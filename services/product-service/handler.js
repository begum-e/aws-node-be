'use strict';

const { getProductsList } = require('./getProductsList');
const { getProductsById } = require('./getProductsById');
const { createProduct } = require('./createProduct');
const { catalogBatchProcess } = require('./catalogBatchProcess');

module.exports.getProductsList = getProductsList;
module.exports.getProductsById = getProductsById;
module.exports.createProduct = createProduct;
module.exports.catalogBatchProcess = catalogBatchProcess;

console.log('** HANDLER.js ** ');

module.exports.hello = async (event) => {
	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: 'Go Serverless v1.0! Your function executed successfully!',
				input: event,
			},
			null,
			2,
		),
	};

	// Use this code if you don't use the http event with the LAMBDA-PROXY integration
	// return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
