"""Plug-and-play guardrail facade for CrewAI projects.

This module is intentionally passive. Use these functions from callbacks,
custom tools, notebooks, or future dependency-injection wiring when you want
guardrails to enforce policies.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

try:
    from .guardrails_config import DEFAULT_GUARDRAILS_CONFIG, GuardrailsConfig
    from .middleware import (
        SensitiveDataFilter,
        SlidingWindowRateLimiter,
        with_input_output_validation,
        with_retry,
        with_tool_validation,
    )
    from .safety import (
        GuardrailViolation,
        SafetyFinding,
        detect_prompt_injection,
        mask_sensitive_mapping,
        mask_sensitive_text,
        validate_url,
    )
    from .validators import (
        validate_agent_config,
        validate_config,
        validate_text_input,
        validate_text_output,
        validate_tool_call,
    )
except ImportError:
    from guardrails_config import DEFAULT_GUARDRAILS_CONFIG, GuardrailsConfig
    from middleware import (
        SensitiveDataFilter,
        SlidingWindowRateLimiter,
        with_input_output_validation,
        with_retry,
        with_tool_validation,
    )
    from safety import (
        GuardrailViolation,
        SafetyFinding,
        detect_prompt_injection,
        mask_sensitive_mapping,
        mask_sensitive_text,
        validate_url,
    )
    from validators import (
        validate_agent_config,
        validate_config,
        validate_text_input,
        validate_text_output,
        validate_tool_call,
    )


def validate_research_topic(
    topic: str,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> str:
    """Validate the `{topic}` runtime input used by the current crew."""

    return validate_text_input(topic, "topic", config)


def validate_research_output(
    output: str,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> str:
    """Validate a research task output without altering it."""

    return validate_text_output(output, "research_output", config)


def sanitize_for_logging(
    value: Any,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> Any:
    """Return a redacted copy of values before logging or error reporting."""

    if isinstance(value, str):
        return mask_sensitive_text(value, config)
    if isinstance(value, Mapping):
        return mask_sensitive_mapping(value, config)
    return value


__all__ = [
    "DEFAULT_GUARDRAILS_CONFIG",
    "GuardrailViolation",
    "GuardrailsConfig",
    "SafetyFinding",
    "SensitiveDataFilter",
    "SlidingWindowRateLimiter",
    "detect_prompt_injection",
    "mask_sensitive_mapping",
    "mask_sensitive_text",
    "sanitize_for_logging",
    "validate_agent_config",
    "validate_config",
    "validate_research_output",
    "validate_research_topic",
    "validate_text_input",
    "validate_text_output",
    "validate_tool_call",
    "validate_url",
    "with_input_output_validation",
    "with_retry",
    "with_tool_validation",
]
