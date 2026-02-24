import failureLambda from "failure-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

export const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const randomInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

export const baseHandler = async (event, context) => {
  const id = randomInt(1, 16);
  console.log(JSON.stringify({ action: "getItem", id }));

  const { Item } = await dynamoDb.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id },
    })
  );

  if (!Item) {
    console.log(JSON.stringify({ action: "notFound", id }));
    return { statusCode: 404, body: JSON.stringify({ error: "Item not found" }) };
  }

  Item.Duration = context.getRemainingTimeInMillis();
  console.log(JSON.stringify({ action: "success", id, itemName: Item.itemName }));

  return {
    statusCode: 200,
    body: JSON.stringify(Item),
  };
};

export const handler = failureLambda(baseHandler);
