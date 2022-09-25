const { getProductsById } = require('../getProductsById');

describe('getProductsById - Not found product', () => {

   it('Get Products By Id Test', async () => {
    const response = await getProductsById({pathParameters: {
      productId: "1" }});
    const { headers, statusCode, body } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(404);
    expect(JSON.parse(response.body)).toBe("Opps! Cannot find product with id 1");
		expect(body || headers).toBeTruthy();
  });
});


describe('getProductsById - Found product', () => {

  it('Get Products By Id Test', async () => {
   const response = await getProductsById({pathParameters: {
     productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" }});
   const { headers, statusCode, body } = response;

   expect(response).toBeDefined();
   expect(statusCode).toBe(200);
   expect(body || headers).toBeTruthy();
 });
 

 describe('getProductsById - Empty Product id', () => {

  it('Get Products By Id Test', async () => {
    const response = await getProductsById({pathParameters: {}});

   const { headers, statusCode, body } = response;

   expect(response).toBeDefined();
   expect(statusCode).toBe(404);
   expect(JSON.parse(response.body)).toBe("Please enter product id");
   expect(body || headers).toBeTruthy();
 });
});


});