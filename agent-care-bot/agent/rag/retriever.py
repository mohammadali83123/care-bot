"""Retriever wrapping a vector store."""

from typing import List

from .vector_store import InMemoryVectorStore


class Retriever:
    def __init__(self, store: InMemoryVectorStore) -> None:
        self.store = store

    def retrieve(self, query_embedding: List[float], top_k: int = 4) -> List[str]:
        return self.store.similar(query_embedding, top_k=top_k)


