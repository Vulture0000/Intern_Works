"""Sensitive-data protection and prompt safety utilities."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Iterable, Mapping
from urllib.parse import urlparse

try:
    from .guardrails_config import DEFAULT_GUARDRAILS_CONFIG, GuardrailsConfig
except ImportError:
    from guardrails_config import DEFAULT_GUARDRAILS_CONFIG, GuardrailsConfig


@dataclass(frozen=True)
class SafetyFinding:
    """A single guardrail finding suitable for logs or validation errors."""

    code: str
    message: str
    severity: str = "medium"


class GuardrailViolation(ValueError):
    """Raised when input or output violates an explicit safety policy."""

    def __init__(self, findings: Iterable[SafetyFinding]) -> None:
        self.findings = tuple(findings)
        message = "; ".join(f"{item.code}: {item.message}" for item in self.findings)
        super().__init__(message or "guardrail violation")


def mask_sensitive_text(
    value: str,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> str:
    """Redact common API keys, bearer tokens, and key-value secrets in text."""

    masked = value
    for pattern in config.sensitive_value_patterns:
        masked = pattern.sub(config.redact_replacement, masked)
    return masked


def mask_sensitive_mapping(
    value: Mapping[str, Any],
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> dict[str, Any]:
    """Return a deep-ish redacted copy of a mapping for logging."""

    result: dict[str, Any] = {}
    for key, item in value.items():
        normalized_key = str(key).lower().replace("-", "_")
        if normalized_key in config.sensitive_keys or any(part in normalized_key for part in config.sensitive_keys):
            result[str(key)] = config.redact_replacement
        elif isinstance(item, str):
            result[str(key)] = mask_sensitive_text(item, config)
        elif isinstance(item, Mapping):
            result[str(key)] = mask_sensitive_mapping(item, config)
        elif isinstance(item, list):
            result[str(key)] = [
                mask_sensitive_text(entry, config) if isinstance(entry, str) else entry
                for entry in item
            ]
        else:
            result[str(key)] = item
    return result


def detect_prompt_injection(
    text: str,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> tuple[SafetyFinding, ...]:
    """Detect common prompt-injection attempts without mutating the text."""

    findings: list[SafetyFinding] = []
    for pattern in config.prompt_injection_patterns:
        if pattern.search(text):
            findings.append(
                SafetyFinding(
                    code="prompt_injection_pattern",
                    message="Input contains language commonly used to override instructions.",
                    severity="high",
                )
            )
            break
    return tuple(findings)


def validate_url(
    url: str,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> tuple[SafetyFinding, ...]:
    """Validate URLs before web scraping or external fetch operations."""

    parsed = urlparse(url)
    findings: list[SafetyFinding] = []
    if parsed.scheme.lower() not in config.allowed_url_schemes:
        findings.append(SafetyFinding("blocked_url_scheme", f"URL scheme is not allowed: {parsed.scheme}", "high"))
    host = (parsed.hostname or "").lower()
    if host in config.blocked_hosts:
        findings.append(SafetyFinding("blocked_host", f"URL host is blocked: {host}", "high"))
    if not host:
        findings.append(SafetyFinding("missing_host", "URL must include a hostname.", "medium"))
    return tuple(findings)
