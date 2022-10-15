import { main } from './importProductsFile';
import { describe, expect } from '@jest/globals';
import * as AWSMock from 'aws-sdk-mock';

const file = "testFile.csv";
const event = {
    queryStringParameters:
        { name: file }
};
const context = {} as any;
const callback = {} as any;


describe("import-products-file tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules()
    })
    afterEach(() => {
        AWSMock.restore();
    });

    it("Should get equal signed url", async () => {

        AWSMock.mock("S3", "getSignedUrl", `/uploaded/${file}`);

        const response = await main(event, context, callback);
        expect(response.statusCode).toBe(200);

        const { signedUrl } = JSON.parse(response.body);
        expect(signedUrl).toContain(`/uploaded/${file}`);
    });

    it("Should get 400 when queryparam is not provided", async () => {
        AWSMock.mock('S3', "getSignedUrl", () => { });
        const response = await main({}, context, callback);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual("Missing Parameters");
    });

    it("Should get 400 when file name is not provided", async () => {
        AWSMock.mock('S3', "getSignedUrl", () => { });
        const response = await main({
            queryStringParameters:
                { name: '' }
        }, context, callback);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual("Missing name");
    });

});