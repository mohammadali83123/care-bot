"""Conversation memory primitives."""

from typing import Any, Dict, List


class ConversationMemory:
    def __init__(self) -> None:
        self.messages: List[Dict[str, Any]] = []

    def add(self, role: str, content: str) -> None:
        self.messages.append({"role": role, "content": content})

    def get(self) -> List[Dict[str, Any]]:
        return list(self.messages)


