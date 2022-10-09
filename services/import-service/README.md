### IMPORT SERVICE

Created with the help of aws-nodejs-typescript (https://github.com/serverless/examples/) template.

> framework: v3
> platform: AWS
> language: nodeJS

- File serverless.yml contains configuration for lambda functions
- The lambda functions returns a correct response which can be used to upload a file into the S3 bucket
- Frontend application is integrated with lambdas
- The lambda functions are implemented and serverless.yml contains configuration for the lambda

################################################################

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function functionName
```

Which should result in response similar to the following:

```
{
    "statusCode": 200,
    "body": "{\n  \"signedUrl\": \"https://serviceName-bucket.s3.region.amazonaws.com/folder/fileName.csv?Content-Type=fileName%2Fcsv&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIZ09%2Fregion%2Fs3%2Faws4_request&X-Amz-Date=202210058Z&\"}"
}
```
