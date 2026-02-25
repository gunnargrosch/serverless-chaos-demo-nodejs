"""Tests for the layer-based Lambda handler."""

import json
import os
import unittest
from decimal import Decimal
from unittest.mock import MagicMock, patch

os.environ.setdefault("TABLE_NAME", "test-table")

from app import DecimalEncoder, handler


class TestDecimalEncoder(unittest.TestCase):
    def test_encodes_integer_decimal(self):
        result = json.dumps({"value": Decimal("42")}, cls=DecimalEncoder)
        self.assertEqual(json.loads(result), {"value": 42})

    def test_encodes_float_decimal(self):
        result = json.dumps({"value": Decimal("3.14")}, cls=DecimalEncoder)
        self.assertAlmostEqual(json.loads(result)["value"], 3.14)


class TestHandler(unittest.TestCase):
    def setUp(self):
        self.context = MagicMock()
        self.context.get_remaining_time_in_millis.return_value = 2500

    @patch("app.table")
    def test_returns_200_with_item(self, mock_table):
        mock_table.get_item.return_value = {
            "Item": {"id": Decimal("1"), "itemName": "One", "itemUrl": "/images/test.jpg"}
        }

        result = handler({}, self.context)

        self.assertEqual(result["statusCode"], 200)
        body = json.loads(result["body"])
        self.assertEqual(body["itemName"], "One")
        self.assertEqual(body["remainingTime"], 2500)

    @patch("app.table")
    def test_returns_404_when_not_found(self, mock_table):
        mock_table.get_item.return_value = {}

        result = handler({}, self.context)

        self.assertEqual(result["statusCode"], 404)
        body = json.loads(result["body"])
        self.assertEqual(body["error"], "Item not found")


    def test_decimal_encoder_raises_for_unsupported_type(self):
        with self.assertRaises(TypeError):
            json.dumps({"value": object()}, cls=DecimalEncoder)


if __name__ == "__main__":
    unittest.main()
