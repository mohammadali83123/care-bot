"""Vector store abstraction and simple in-memory index placeholder."""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class InMemoryVectorStore:
    """Naive in-memory vector store placeholder.

    Replace with FAISS, Chroma, or a managed vector DB.
    """

    embeddings: List[Tuple[List[float], str]]

    def __init__(self) -> None:
        self.embeddings = []

    def add(self, embedding: List[float], text: str) -> None:
        self.embeddings.append((embedding, text))

    def similar(self, query_embedding: List[float], top_k: int = 4) -> List[str]:
        def dot(a: List[float], b: List[float]) -> float:
            return sum(x * y for x, y in zip(a, b))

        ranked = sorted(self.embeddings, key=lambda e: dot(query_embedding, e[0]), reverse=True)
        return [t for _, t in ranked[:top_k]]


