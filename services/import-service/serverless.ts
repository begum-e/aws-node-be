import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import { importProductsFile, importFileParser } from '@functions/index';
dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: "eu-west-1",
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: '${env:BUCKET_NAME}',
      TARGET_FOLDER: '${env:TARGET_FOLDER}',
      SOURCE_FOLDER: '${env:SOURCE_FOLDER}',
      REGION: '${env:REGION }',
      SQS_QUEUE_NAME: '${env:SQS_QUEUE_NAME}',
      SQS_QUEUE_URL: '${env:SQS_QUEUE_URL}',

    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::${env:BUCKET_NAME}',
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::${env:BUCKET_NAME}/*',
      }, {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: '${env:SQS_ARN}'
      }
    ],
  },
  // imported the configs via paths which is in @functions/index
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
