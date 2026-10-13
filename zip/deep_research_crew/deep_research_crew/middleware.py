"""Optional decorators, wrappers, logging filters, and retry helpers."""

from __future__ import annotations

from collections import deque
from functools import wraps
from logging import Filter, LogRecord
from threading import Lock
from time import monotonic, sleep
from typing import Any, Callable, TypeVar

try:
    from .guardrails_config import DEFAULT_GUARDRAILS_CONFIG, GuardrailsConfig
    from .safety import GuardrailViolation, SafetyFinding, mask_sensitive_text
    from .validators import validate_text_input, validate_text_output, validate_tool_call
except ImportError:
    from guardrails_config import DEFAULT_GUARDRAILS_CONFIG, GuardrailsConfig
    from safety import GuardrailViolation, SafetyFinding, mask_sensitive_text
    from validators import validate_text_input, validate_text_output, validate_tool_call


T = TypeVar("T")


class SensitiveDataFilter(Filter):
    """Logging filter that masks secrets before records are emitted."""

    def __init__(self, config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG) -> None:
        super().__init__()
        self.config = config

    def filter(self, record: LogRecord) -> bool:
        record.msg = mask_sensitive_text(str(record.msg), self.config)
        if record.args:
            record.args = tuple(
                mask_sensitive_text(arg, self.config) if isinstance(arg, str) else arg
                for arg in record.args
            )
        return True


class SlidingWindowRateLimiter:
    """Small in-memory rate limiter for CLI, notebook, or tool wrappers."""

    def __init__(
        self,
        max_requests: int = DEFAULT_GUARDRAILS_CONFIG.rate_limit_requests,
        window_seconds: float = DEFAULT_GUARDRAILS_CONFIG.rate_limit_window_seconds,
    ) -> None:
        if max_requests <= 0 or window_seconds <= 0:
            raise ValueError("Rate limiter values must be positive.")
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._events: deque[float] = deque()
        self._lock = Lock()

    def check(self) -> None:
        now = monotonic()
        with self._lock:
            while self._events and now - self._events[0] >= self.window_seconds:
                self._events.popleft()
            if len(self._events) >= self.max_requests:
                raise GuardrailViolation(
                    [SafetyFinding("rate_limit_exceeded", "Request rate limit exceeded.", "medium")]
                )
            self._events.append(now)


def with_input_output_validation(
    func: Callable[..., T],
    *,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> Callable[..., T]:
    """Decorate a callable to validate string args and string output."""

    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        for index, value in enumerate(args):
            if isinstance(value, str):
                validate_text_input(value, f"arg_{index}", config)
        for key, value in kwargs.items():
            if isinstance(value, str):
                validate_text_input(value, key, config)
        result = func(*args, **kwargs)
        if isinstance(result, str):
            validate_text_output(result, "return_value", config)
        return result

    return wrapper


def with_tool_validation(
    tool_name: str,
    func: Callable[..., T],
    *,
    config: GuardrailsConfig = DEFAULT_GUARDRAILS_CONFIG,
) -> Callable[..., T]:
    """Decorate a tool callable with allowlist and payload validation."""

    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        validate_tool_call(tool_name, kwargs, config)
        return func(*args, **kwargs)

    return wrapper


def with_retry(
    func: Callable[..., T],
    *,
    attempts: int = DEFAULT_GUARDRAILS_CONFIG.retry_attempts,
    initial_delay_seconds: float = DEFAULT_GUARDRAILS_CONFIG.retry_initial_delay_seconds,
    backoff_multiplier: float = DEFAULT_GUARDRAILS_CONFIG.retry_backoff_multiplier,
    retry_on: tuple[type[BaseException], ...] = (TimeoutError, ConnectionError),
) -> Callable[..., T]:
    """Retry transient failures without catching guardrail violations."""

    if attempts < 1:
        raise ValueError("attempts must be at least 1")

    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        delay = initial_delay_seconds
        last_error: BaseException | None = None
        for attempt in range(attempts):
            try:
                return func(*args, **kwargs)
            except GuardrailViolation:
                raise
            except retry_on as exc:
                last_error = exc
                if attempt == attempts - 1:
                    break
                if delay > 0:
                    sleep(delay)
                delay *= backoff_multiplier
        if last_error is not None:
            raise last_error
        return func(*args, **kwargs)

    return wrapper
