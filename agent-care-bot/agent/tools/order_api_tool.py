"""Order API tool example.

Implement real HTTP calls and error handling as needed.
"""

from typing import Any, Dict, List


def get_user_orders(user_id: str) -> List[Dict[str, Any]]:
    """Return a list of orders for the given user.

    This is a stub. Replace with a real API call.
    """
    return [
        {"orderId": "ORD-001", "status": "shipped", "userId": user_id},
        {"orderId": "ORD-002", "status": "processing", "userId": user_id},
    ]


