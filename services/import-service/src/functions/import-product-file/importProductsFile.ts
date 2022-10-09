import { middyfy } from '../../libs/lambda';
import S3Client from 'aws-sdk/clients/s3';
import { APIGatewayProxyEvent } from 'aws-lambda';
import dotenv from 'dotenv';
dotenv.config();

const { BUCKET_NAME, REGION } = process.env;

const importProductsFile = async (event: APIGatewayProxyEvent) => {

  try {
    const S3 = new S3Client({ region: REGION, signatureVersion: 'v4' })

    if (!event || !event.queryStringParameters) {
      return { statusCode: 400, body: "Missing Parameters" };
    }

    const { name } = event.queryStringParameters;
    if (!name) {
      return { statusCode: 400, body: "Missing name" };
    }
    console.log("*** File name:", name);

    const params = {
      Bucket: BUCKET_NAME,
      Key: `uploaded/${name}`,
      ContentType: 'text/csv',
      Expires: 3600
    }
    console.log('*** params: ', params);

    const signedUrl = S3.getSignedUrl("putObject", params)
    console.log('*** signedUrl: ', { signedUrl });

    return {
      statusCode: 200,
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify({ signedUrl })
    }

  } catch (err) {
    console.log("Internal server error", err);
    return { statusCode: 500, body: "Internal server error:" + err };
  }
};

export const main = middyfy(importProductsFile);
