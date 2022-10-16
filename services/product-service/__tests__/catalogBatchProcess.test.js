const { catalogBatchProcess } = require('../catalogBatchProcess');
const AWS = require('aws-sdk');
const awsMock = require('aws-sdk-mock');

awsMock.mock('DynamoDB.DocumentClient', 'put', '');

const event = {
	Records: [
		{ body: '{"title":"t1","description":"d1","price":5,"count":5}' },
		{ body: '{"title":"t2","description":"d2","price":10,"count":10}' },
	],
};

describe('catalogBatchProcess', () => {
	awsMock.setSDKInstance(AWS);

	const sns = jest.fn((err, data) => 'response');
	awsMock.mock('SNS', 'publish', sns);

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetModules();
		awsMock.restore();
	});

	it('Should Successfully processed 2 new records', async () => {
		const response = await catalogBatchProcess(event);
		expect(response).toBeDefined();
		expect(response.statusCode).toBe(200);

		expect(sns).toHaveBeenCalledTimes(2);
	});

	it('Should Not processed invalid event', async () => {
		const response = await catalogBatchProcess({});
		expect(response).toBeDefined();
		expect(response.statusCode).toBe(500);

		expect(sns).toHaveBeenCalledTimes(0);
	});

	it('Should Not processed invalid record type', async () => {
		const event = {
			Records: [
				{ body: { title: 'title1', description: 'desc1', price: '5' } },
			],
		};

		const response = await catalogBatchProcess({});
		expect(response).toBeDefined();
		expect(response.statusCode).toBe(500);

		expect(sns).toHaveBeenCalledTimes(0);
	});
});
