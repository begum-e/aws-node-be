const AWS = require("aws-sdk");
const { PRODUCTS_TABLE, STOCKS_TABLE, REGION } = process.env;
const ddb = new AWS.DynamoDB({ region: REGION });

const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "N",
    },
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: PRODUCTS_TABLE,
  StreamSpecification: {
    StreamEnabled: false,
  },
};

const stocktTblParams = {
  AttributeDefinitions: [
    {
      AttributeName: "product_id",
      AttributeType: "N",
    },
  ],
  KeySchema: [
    {
      AttributeName: "product_id",
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: STOCKS_TABLE,
  StreamSpecification: {
    StreamEnabled: false,
  },
};

ddb.createTable(tableParams, function (err, data) {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Success:", data);
  }
});
