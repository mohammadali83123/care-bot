"""Guardrails and safety checks for the agent."""

from typing import Final


DISALLOWED_TOPICS: Final[list[str]] = [
    "medical diagnosis",
    "legal advice",
    "financial guarantees",
]


def is_allowed(topic: str) -> bool:
    normalized = topic.strip().lower()
    return normalized not in DISALLOWED_TOPICS


