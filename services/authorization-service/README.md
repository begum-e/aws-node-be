### AUTHORIZATION SERVICE

> framework: v3
> platform: AWS
> language: nodeJS

- Service called authorization-service with its own serverless.yml
- lambda function called basicAuthorizer by taking Basic Authorization token, decodes it and check that credentials provided by token exist in the lambda environment variable

################################################################

Created with the help of aws-nodejs-typescript (https://github.com/serverless/examples/) template.

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
