"""Document loader utilities for PDFs, TXT, and other formats.

Replace stubs with LangChain loaders as needed.
"""

from typing import List


def load_documents(paths: List[str]) -> List[str]:
    """Load raw documents from file paths.

    Args:
        paths: List of filesystem paths.

    Returns:
        Raw document strings for further processing.
    """
    contents: List[str] = []
    for path in paths:
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                contents.append(f.read())
        except FileNotFoundError:
            continue
    return contents


