const { getProductsList } = require('../../product-service/getProductsList');

describe('getProductsList', () => {

   it('Get All Products test', async () => {
    const response = await getProductsList();
    const { headers, statusCode, body } = response;

    expect(response).toBeDefined();
		expect(body || headers).toBeTruthy();
		expect(statusCode).toBe(200);
  });
});