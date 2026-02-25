"""Lambda handler for the layer-based function.

No failure-lambda import needed — the Lambda Layer intercepts the
Runtime API and injects failures transparently.
"""

import json
import logging
import os
import random
from decimal import Decimal

import boto3

logger = logging.getLogger()
logger.setLevel(os.environ.get("LOG_LEVEL", "INFO"))

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])


class DecimalEncoder(json.JSONEncoder):
    """Convert DynamoDB Decimal types to int/float for JSON serialization."""

    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super().default(obj)


def handler(event, context):
    item_id = random.randint(1, 16)
    logger.info(json.dumps({"action": "getItem", "id": item_id}))

    response = table.get_item(Key={"id": item_id})
    item = response.get("Item")

    if not item:
        logger.info(json.dumps({"action": "notFound", "id": item_id}))
        return {
            "statusCode": 404,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Item not found"}),
        }

    item["remainingTime"] = context.get_remaining_time_in_millis()
    logger.info(
        json.dumps({"action": "success", "id": item_id, "itemName": item.get("itemName")})
    )

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(item, cls=DecimalEncoder),
    }
