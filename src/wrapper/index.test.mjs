import { describe, it, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

process.env.TABLE_NAME = "test-table";
process.env.FAILURE_INJECTION_PARAM = "test-param";

import { baseHandler, dynamoDb } from "./index.mjs";

describe("wrapper handler", () => {
  const mockContext = { getRemainingTimeInMillis: () => 2500 };

  beforeEach(() => {
    mock.restoreAll();
  });

  it("should return 200 with item data", async () => {
    const mockItem = { id: 1, itemName: "One", itemUrl: "/images/test.jpg" };
    mock.method(dynamoDb, "send", async () => ({ Item: mockItem }));

    const result = await baseHandler({}, mockContext);

    assert.equal(result.statusCode, 200);
    const body = JSON.parse(result.body);
    assert.equal(body.itemName, "One");
    assert.equal(body.remainingTime, 2500);
  });

  it("should return 404 when item is not found", async () => {
    mock.method(dynamoDb, "send", async () => ({}));

    const result = await baseHandler({}, mockContext);

    assert.equal(result.statusCode, 404);
    const body = JSON.parse(result.body);
    assert.equal(body.error, "Item not found");
  });

  it("should query the correct table", async () => {
    const mockItem = { id: 3, itemName: "Three", itemUrl: "/images/test.jpg" };
    const sendMock = mock.method(dynamoDb, "send", async () => ({ Item: mockItem }));

    await baseHandler({}, mockContext);

    const command = sendMock.mock.calls[0].arguments[0];
    assert.equal(command.input.TableName, "test-table");
    assert.ok(command.input.Key.id >= 1 && command.input.Key.id <= 16);
  });

  it("should not mutate the DynamoDB item object", async () => {
    const mockItem = { id: 2, itemName: "Two", itemUrl: "/images/test.jpg" };
    mock.method(dynamoDb, "send", async () => ({ Item: mockItem }));

    await baseHandler({}, mockContext);

    // remainingTime must not be added to the original object
    assert.equal(mockItem.remainingTime, undefined);
  });
});
