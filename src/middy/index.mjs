import middy from "@middy/core";
import { failureLambdaMiddleware } from "failure-lambda/middy";
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
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Item not found" }),
    };
  }

  // Spread to avoid mutating the object returned from DynamoDB
  const responseItem = { ...Item, remainingTime: context.getRemainingTimeInMillis() };
  console.log(JSON.stringify({ action: "success", id, itemName: Item.itemName }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(responseItem),
  };
};

export const handler = middy(baseHandler).use(failureLambdaMiddleware());
