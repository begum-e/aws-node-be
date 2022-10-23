export const basicAuthorizer = async (event: any, ctx: any, callback: any) => {
    console.info("** Basic Authorizer started: ", event);

    if (event.type !== "TOKEN") {
        console.info("** Event Type Unauthorized token")
        callback('Unauthorized');
    }
    try {
        const { authorizationToken, methodArn } = event;
        if (!authorizationToken) {
            callback('Unauthorized');
        }
        const encodedCreds = authorizationToken.split(' ')[1];
        console.info("** encodedCreds", encodedCreds)

        if (!encodedCreds) {
            console.info("** Token missing:", encodedCreds)
            callback('Unauthorized');
        }

        const credentials = Buffer.from(encodedCreds, 'base64')
            .toString('utf-8')
            .split(':');

        const userName = credentials[0];
        const password = credentials[1];
        console.log(`Username ${userName}`);

        const storedToken = process.env[userName];
        const effect = checkToken(storedToken, password) ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCreds, methodArn, effect);
        callback(null, policy);

    } catch (e) {
        console.log(' ** Error: ', e);
        callback('Unauthorized');
    }

};

const checkToken = (storedPassword: string, password: string) => {
    return (!storedPassword || storedPassword !== password);
}

const generatePolicy = (principalId: string, resource: string, effect: 'Allow' | 'Deny') => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
}
