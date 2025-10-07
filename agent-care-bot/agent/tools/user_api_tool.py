"""User API tool example.

Implement real HTTP calls and error handling as needed.
"""

from typing import Any, Dict


def is_user_registered(user_id: str) -> Dict[str, Any]:
    """Check whether a user is registered.

    This is a stub. Replace with a real API call.
    """
    return {"userId": user_id, "registered": True}


