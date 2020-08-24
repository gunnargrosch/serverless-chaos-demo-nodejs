'use strict'
const failureLambda = require('failure-lambda')
const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()
let response

exports.handler = failureLambda(async (event, context) => {
  function random(low, high) {
    return Math.round(Math.random() * (high - low) + low)
  }
  const ddbParams = {
    TableName: process.env.FAILURE_INJECTION_TABLE,
    Key: {
      id: random(1, 16) //Math.floor(Math.random() * 16) + 1,
    },
  }
  console.log(ddbParams)
  try {
    dynamoDb.get(ddbParams, (error, result) => {
      if (error) {
        console.error(error);
        const errorResponse = {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t fetch the item.',
        };
        return errorResponse;
      }
      result.Item.Duration = context.getRemainingTimeInMillis()
      response = {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            },
        'body': JSON.stringify(result.Item)
      }
    })
  } catch (err) {
    console.log(err)
    return err
  }

  return response
})
