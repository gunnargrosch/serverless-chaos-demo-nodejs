#!/usr/bin/env bash
set -euo pipefail

TABLE_NAME="${1:?Usage: npm run seed -- <table-name>}"

jq --arg t "$TABLE_NAME" '{ ($t): .YOUR_DYNAMODB_TABLE_NAME }' dynamodb.json.template > dynamodb.json
aws dynamodb batch-write-item --request-items file://dynamodb.json

echo "Seeded table '$TABLE_NAME' with 16 items."
