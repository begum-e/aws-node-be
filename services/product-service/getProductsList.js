const { createResponse } = require('../helpers/createResponse');
const { products } = require('./mocks/products');

module.exports.getProductsList = async (event) => {
    console.log(products);
    return createResponse(200, products);
}