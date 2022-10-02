const { createResponse } = require("../helpers/createResponse");
const { formatObjResponse } = require("../helpers/formatResponse");
const { DynamoDB } = require("aws-sdk");
const { PRODUCTS_TABLE, STOCKS_TABLE, REGION } = process.env;
const dynamoDb = new DynamoDB.DocumentClient({ region: REGION });

module.exports.getProductsById = async (event) => {
  let result;
  let statusCode = 200;

  console.info("*** Checking DB Connection ***");
  if (!dynamoDb) {
    return createResponse(500, "Connection Failed");
  }

  console.log("*** Getting Product: ", event.pathParameters);

  const pathParameters = event.pathParameters;
  if (!pathParameters) {
    return createResponse(500, "Missing pathParameters");
  }

  const foundProduct = await dynamoDb
    .get({ TableName: PRODUCTS_TABLE, Key: { id: pathParameters.productId } })
    .promise()
    .then((res) => {
      console.log("*** Product:", res);
      return res;
    })
    .catch((err) => {
      console.error("*** Error: ", err.message);
      return createResponse(500, err.message);
    });

  const foundStock = await dynamoDb
    .get({ TableName: STOCKS_TABLE, Key: { product_id: pathParameters.productId } })
    .promise()
    .then((res) => {
      console.log("*** Stock:", res);
      return res;
    })
    .catch((err) => {
      console.error("*** Error: ", err.message);
      return createResponse(500, err.message);
    });

  try {
    console.info("*** Joining results ***");
    result = formatObjResponse(foundProduct, foundStock);

    if (!result) {
      return createResponse(404, "Product has not stock!");
    }
  } catch (err) {
    console.error("*** Error: ", err.message);
    return createResponse(500, err.message);
  }
  console.log("*** Result: ", result, " StatusCode:", statusCode);

  return createResponse(statusCode, result);
};
