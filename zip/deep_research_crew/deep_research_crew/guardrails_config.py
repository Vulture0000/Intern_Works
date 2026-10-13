"""Configuration primitives for optional guardrails.

These defaults are intentionally conservative and side-effect free. Importing
this module does not read environment variables or change application behavior.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import FrozenSet, Mapping, Pattern
import re


DEFAULT_ALLOWED_URL_SCHEMES: FrozenSet[str] = frozenset({"http", "https"})
DEFAULT_BLOCKED_HOSTS: FrozenSet[str] = frozenset(
    {
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "::1",
        "169.254.169.254",
    }
)
DEFAULT_SENSITIVE_KEYS: FrozenSet[str] = frozenset(
    {
        "api_key",
        "apikey",
        "authorization",
        "bearer",
        "client_secret",
        "gemini_api_key",
        "password",
        "secret",
        "serper_api_key",
        "token",
    }
)
DEFAULT_TOOL_ALLOWLIST: FrozenSet[str] = frozenset(
    {
        "SerperDevTool",
        "ScrapeWebsiteTool",
        "FileReadTool",
        "FileWriterTool",
    }
)

SENSITIVE_VALUE_PATTERNS: tuple[Pattern[str], ...] = (
    re.compile(r"(?i)(api[_-]?key|token|secret|password)\s*[:=]\s*['\"]?([A-Za-z0-9_\-\.]{8,})"),
    re.compile(r"(?i)\bBearer\s+[A-Za-z0-9_\-\.=]{12,}"),
    re.compile(r"\bAIza[0-9A-Za-z_\-]{20,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_\-]{20,}\b"),
)

PROMPT_INJECTION_PATTERNS: tuple[Pattern[str], ...] = (
    re.compile(r"(?i)\bignore\s+(all\s+)?(previous|prior|above)\s+instructions\b"),
    re.compile(r"(?i)\b(disregard|override)\s+(the\s+)?(system|developer|safety)\s+(prompt|instructions)\b"),
    re.compile(r"(?i)\breveal\s+(your\s+)?(system|developer)\s+(prompt|instructions)\b"),
    re.compile(r"(?i)\bexfiltrate\b|\bdata\s+exfiltration\b"),
    re.compile(r"(?i)\bprint\s+env\b|\bdump\s+environment\b"),
)


@dataclass(frozen=True)
class GuardrailsConfig:
    """Runtime-neutral configuration for optional guardrail wrappers."""

    max_input_chars: int = 12000
    max_output_chars: int = 50000
    max_tool_name_chars: int = 128
    max_tool_payload_chars: int = 20000
    rate_limit_requests: int = 60
    rate_limit_window_seconds: float = 60.0
    retry_attempts: int = 3
    retry_initial_delay_seconds: float = 0.25
    retry_backoff_multiplier: float = 2.0
    allowed_url_schemes: FrozenSet[str] = DEFAULT_ALLOWED_URL_SCHEMES
    blocked_hosts: FrozenSet[str] = DEFAULT_BLOCKED_HOSTS
    sensitive_keys: FrozenSet[str] = DEFAULT_SENSITIVE_KEYS
    allowed_tools: FrozenSet[str] = DEFAULT_TOOL_ALLOWLIST
    prompt_injection_patterns: tuple[Pattern[str], ...] = PROMPT_INJECTION_PATTERNS
    sensitive_value_patterns: tuple[Pattern[str], ...] = SENSITIVE_VALUE_PATTERNS
    redact_replacement: str = "[REDACTED]"

    @classmethod
    def from_mapping(cls, values: Mapping[str, object]) -> "GuardrailsConfig":
        """Create config from a mapping while ignoring unknown keys."""

        allowed_keys = cls.__dataclass_fields__.keys()
        filtered = {key: value for key, value in values.items() if key in allowed_keys}
        return cls(**filtered)


DEFAULT_GUARDRAILS_CONFIG = GuardrailsConfig()
