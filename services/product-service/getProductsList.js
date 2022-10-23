const { createResponse } = require('../helpers/createResponse');
const { formatArrResponse } = require('../helpers/formatResponse');
const { DynamoDB } = require('aws-sdk');
const { PRODUCTS_TABLE, STOCKS_TABLE, REGION } = process.env;

module.exports.getProductsList = async (event) => {
	let result;
	let statusCode = 200;
	console.log('*** Getting Product List *** ');

	try {
		const dynamoDb = new DynamoDB.DocumentClient({ region: REGION });
		console.log('*** Checking DB Connection ***');
		if (!dynamoDb) {
			return createResponse(500, 'Connection Failed!');
		}

		const productList = await dynamoDb.scan({ TableName: PRODUCTS_TABLE }).promise();

		const stockList = await dynamoDb.scan({ TableName: STOCKS_TABLE }).promise();

		console.log('*** Joining results ***');

		result = formatArrResponse(productList, stockList);
		if (!result) {
			return createResponse(404, 'Products Not Found');
		}
	} catch (err) {
		console.error('*** Error: ', err.message);

		return createResponse(500, err.message);
	}
	console.log('*** Result: ', result, ' StatusCode:', statusCode);

	return createResponse(statusCode, result);
};
