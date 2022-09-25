const { createResponse } = require('../helpers/createResponse');
const { products } = require('./mocks/products');

module.exports.getProductsById = async (event) => {

    if(!products){
       return createResponse(404, "Unable to load Products. Try again later")
    }
    const productId = event.pathParameters.productId;

    if(!productId){
      return createResponse(404, "Please enter product id")
   }
    const product = products.find((item) => {
        return item.id === productId;
    })
    
    if(!product) {
      return createResponse(404,  `Opps! Cannot find product with id ${productId}`)
    };


    return createResponse(200,  product);
}