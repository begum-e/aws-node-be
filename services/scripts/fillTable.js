const AWS = require("aws-sdk");
const { PRODUCTS_TABLE, STOCKS_TABLE, REGION } = process.env;
const ddb = new AWS.DynamoDB({ region: REGION });

// Add the items to PRODUCTS_TABLE
let params = {
  TableName: PRODUCTS_TABLE,
  Item: {
    id: {
      N: "1",
    },
    description: {
      S: "first description",
    },
    price: {
      S: 10,
    },
    title: {
      S: "product title 1",
    },
  },
};
post();

// Add items to STOCKS STOCKS_TABLE
params = {
  TableName: STOCKS_TABLE,
  Item: {
    product_id: {
      S: "1",
    },
    count: {
      N: 10,
    },
  },
};
post();

// Add items to STOCKS
params = {
  TableName: STOCKS_TABLE,
  Item: {
    product_id: {
      S: "2",
    },
    count: {
      N: 20,
    },
  },
};
post();

function post() {
  ddb.putItem(params, function (err, data) {
    if (err) {
      console.err("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}
/* await ddb
      .put({
        TableName: PRODUCTS_TABLE,
        Item: newProduct,
      })
      .promise()
      .catch((err) => {
        console.log(err);
        return createResponse(500, err);
      });*/
