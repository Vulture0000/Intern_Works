"""Input, output, agent, tool, and configuration validators."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

try:
    from .guardrails_config import DEFAULT_GUARDRAILS_CONFIG, GuardrailsConfig
    from .safety import GuardrailViolation, SafetyFinding, detect_prompt_injection, validate_url
except ImportError:
    from guardrails_config import DEFAULT_GUARDRAILS_CONFIG, GuardrailsConfig
    from safety import GuardrailViolation, SafetyFinding, detect_prompt_injection, validate_url


def validate_text_input(
    value: str,
    field_name: str = "input",
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> str:
    """Validate user or task input and return it unchanged on success."""

    findings: list[SafetyFinding] = []
    if not isinstance(value, str):
        findings.append(SafetyFinding("invalid_type", f"{field_name} must be a string."))
    elif len(value) > config.max_input_chars:
        findings.append(SafetyFinding("input_too_large", f"{field_name} exceeds {config.max_input_chars} characters."))
    elif not value.strip():
        findings.append(SafetyFinding("empty_input", f"{field_name} must not be empty."))
    if isinstance(value, str):
        findings.extend(detect_prompt_injection(value, config))
    if findings:
        raise GuardrailViolation(findings)
    return value


def validate_text_output(
    value: str,
    field_name: str = "output",
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> str:
    """Validate generated output shape and return it unchanged on success."""

    findings: list[SafetyFinding] = []
    if not isinstance(value, str):
        findings.append(SafetyFinding("invalid_type", f"{field_name} must be a string."))
    elif len(value) > config.max_output_chars:
        findings.append(SafetyFinding("output_too_large", f"{field_name} exceeds {config.max_output_chars} characters."))
    if findings:
        raise GuardrailViolation(findings)
    return value


def validate_tool_call(
    tool_name: str,
    payload: Mapping[str, Any] | None = None,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> None:
    """Validate a proposed tool execution before dispatch."""

    findings: list[SafetyFinding] = []
    if not isinstance(tool_name, str) or not tool_name.strip():
        findings.append(SafetyFinding("invalid_tool_name", "Tool name must be a non-empty string.", "high"))
    elif len(tool_name) > config.max_tool_name_chars:
        findings.append(SafetyFinding("tool_name_too_large", "Tool name exceeds configured length.", "medium"))
    elif config.allowed_tools and tool_name not in config.allowed_tools:
        findings.append(SafetyFinding("tool_not_allowed", f"Tool is not in the allowlist: {tool_name}", "high"))

    if payload is not None:
        rendered_payload = repr(payload)
        if len(rendered_payload) > config.max_tool_payload_chars:
            findings.append(SafetyFinding("tool_payload_too_large", "Tool payload exceeds configured length.", "medium"))
        for key, value in payload.items():
            if isinstance(value, str):
                findings.extend(detect_prompt_injection(value, config))
                if key.lower() in {"url", "website", "endpoint"}:
                    findings.extend(validate_url(value, config))

    if findings:
        raise GuardrailViolation(findings)


def validate_agent_config(
    agent_config: Mapping[str, Any],
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> None:
    """Validate high-risk agent settings without changing the config."""

    findings: list[SafetyFinding] = []
    tools = agent_config.get("tools", [])
    if not isinstance(tools, list):
        findings.append(SafetyFinding("invalid_tools", "Agent tools must be a list.", "high"))
    else:
        for tool_name in tools:
            validate_tool_call(str(tool_name), None, config)

    settings = agent_config.get("settings", {})
    if isinstance(settings, Mapping) and settings.get("allow_code_execution") is True:
        findings.append(SafetyFinding("code_execution_enabled", "Agent code execution should remain disabled.", "high"))
    if findings:
        raise GuardrailViolation(findings)


def validate_config(config: GuardrailsConfig) -> None:
    """Validate guardrail configuration values."""

    findings: list[SafetyFinding] = []
    if config.max_input_chars <= 0 or config.max_output_chars <= 0:
        findings.append(SafetyFinding("invalid_size_limit", "Input and output limits must be positive."))
    if config.rate_limit_requests <= 0 or config.rate_limit_window_seconds <= 0:
        findings.append(SafetyFinding("invalid_rate_limit", "Rate limit values must be positive."))
    if config.retry_attempts < 1 or config.retry_initial_delay_seconds < 0:
        findings.append(SafetyFinding("invalid_retry_config", "Retry configuration is invalid."))
    if findings:
        raise GuardrailViolation(findings)
