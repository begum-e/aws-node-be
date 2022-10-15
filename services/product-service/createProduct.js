const { createResponse } = require("../helpers/createResponse");
const { PRODUCTS_TABLE, STOCKS_TABLE, REGION } = process.env;
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { TransactWriteCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const dynamoDb = DynamoDBDocumentClient.from(new DynamoDB({ region: REGION }));
const { v4 } = require("uuid");

module.exports.createProduct = async (event) => {
  console.info("*** Checking DB Connection ***");
  if (!dynamoDb) {
    return createResponse(500, "Connection Failed");
  }

  try {
    const newProduct = JSON.parse(event.body);
    console.info("*** Adding Product of : ", newProduct);

    if (!newProduct) {
      return createResponse(500, "invalid product object");
    }

    if (!newProduct.id) {
      console.log("*** Id is empty. Therefore adding random id to: ", newProduct);
      newProduct.id = v4();
      console.log(newProduct.id);
    }

    const { count, ...newProductInfo } = newProduct;
    const newStockInfo = { product_id: newProduct.id, count };
    console.log("*** newStockInfo: ", newStockInfo);

    console.info("*** Transaction started ***");
    const transactionOutput = await dynamoDb.send(
      new TransactWriteCommand({
        TransactItems: [
          { Put: { Item: newProductInfo, TableName: PRODUCTS_TABLE } },
          { Put: { Item: newStockInfo, TableName: STOCKS_TABLE } },
        ],
      })
    );

    if (transactionOutput.$metadata?.httpStatusCode !== 200) {
      return createResponse(httpStatusCode, "Transaction Failed!");
    }

    return createResponse(201, "Successfully added:" + newProduct.id);
  } catch (err) {
    console.error(err);
    return createResponse(500, err);
  }
};
