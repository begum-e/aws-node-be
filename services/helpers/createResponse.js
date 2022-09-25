module.exports.createResponse = (statusCode,message) => ({
    headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      },
      statusCode,
    body: JSON.stringify(message),
  });
