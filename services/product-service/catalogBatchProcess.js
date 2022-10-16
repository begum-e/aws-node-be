const { createResponse } = require('../helpers/createResponse');
const { PRODUCTS_TABLE, STOCKS_TABLE, REGION, SNS_TOPIC_ARN } = process.env;

const AWS = require('aws-sdk');

module.exports.catalogBatchProcess = async (event) => {
	console.log('** catalogBatchProcess started:', event);

	try {
		const dynamodb = new AWS.DynamoDB.DocumentClient();
		const sns = new AWS.SNS({ region: REGION });

		await Promise.all(
			event.Records.map(async (record) => {
				console.log('** record:', record);

				if (!validProduct(record.body)) {
					return {
						statusCode: 400,
						body: 'Invalid data',
					};
				}
				const newRecord = JSON.parse(record.body);

				console.log('** createProduct:', newRecord);
				const { count, ...newProductInfo } = newRecord;
				const newStockInfo = { product_id: newRecord.id, count };
				await dynamodb
					.put({
						TableName: PRODUCTS_TABLE,
						Item: newProductInfo,
					})
					.promise();
				await dynamodb
					.put({
						TableName: STOCKS_TABLE,
						Item: newStockInfo,
					})
					.promise();

				console.log('** New Item created:', newRecord);

				const params = {
					Subject: 'Message from CatalogBatchProcess',
					Message: `New Item. Product ${newRecord.title} created. Price is (${newRecord.price}$)`,
					TopicArn: SNS_TOPIC_ARN,
					MessageAttributes: {
						price: {
							DataType: 'String',
							StringValue: newRecord.price < 5 ? 'high' : 'low',
						},
					},
				};

				await sns
					.publish(params, (err, data) => {
						if (err) console.log('** SNS Error: ', err);
						console.log('** SNS Success: ', data);
						return data;
					})
					.promise();
			}),
		);

		return {
			statusCode: 200,
		};
	} catch (err) {
		console.log(err);
		return createResponse(500, 'Internal Server Error', err);
	}
};

const validProduct = (data) => {
	const { count, description, price, title } = data;

	if (
		typeof count !== 'number' ||
		typeof description !== 'string' ||
		typeof price !== 'number' ||
		typeof title !== 'string'
	) {
		console.log('** Data Validation error', data);

		return {
			statusCode: 400,
			body: 'Invalid data',
		};
	}
};
