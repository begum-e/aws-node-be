import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/importProductsFile.main`,
    events: [
        {
            http: {
                method: 'get',
                path: '/import',
                request: {
                    parameters: {
                        querystrings: {
                            name: true
                        }
                    }
                },
                cors: true,
                authorizer: {
                    arn: '${env:AUTHORIZER_LAMBDA_ARN}',
                    resultTtlInSeconds: 0,
                    identitySource: 'method.request.header.Authorization',
                    type: 'token'
                }
            },
        },
    ],
};