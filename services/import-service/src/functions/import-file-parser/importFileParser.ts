import csvParser from 'csv-parser';
import { S3 } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { S3Event } from 'aws-lambda';
import { copySourceTo } from '../helper';
import dotenv from 'dotenv';
dotenv.config();

const parser = csvParser();
const { REGION, BUCKET_NAME, SOURCE_FOLDER, TARGET_FOLDER } = process.env;


export const importFileParser = async (event: S3Event) => {
    console.log(`** FileParser Event : ${JSON.stringify(event)}`);

    const s3 = new S3({ region: REGION });

    try {
        const key = event.Records?.[0]?.s3?.object?.key;
        if (!key) {
            return { statusCode: 400, body: "File Not Found" };
        };

        console.log("** File:", key);

        if (!key.endsWith('.csv')) {
            console.log("** Skipping non csv files ** ");
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: key
        };

        const s3Stream = s3.getObject(params).createReadStream();
        if (s3Stream) { console.log("** Read Stream created **"); }


        const result = await new Promise<void>((resolve, reject) => {
            s3Stream
                .pipe(parser)
                .on("error", error => {
                    console.error("**  Error:", error)
                    reject(error)
                })
                .on("data", data => {
                    console.log("** Data:", data)
                })
                .on("end", async () => {
                    console.log(`** Copy Started: ${key}`)

                    await s3.copyObject(
                        copySourceTo(BUCKET_NAME, key, SOURCE_FOLDER, TARGET_FOLDER)
                    ).promise();

                    await s3.deleteObject(params).promise();

                    console.log(`** Copy Ended. Reading of ${key} file ended and moved to ${TARGET_FOLDER} folder`)

                    resolve();
                });
        });

        console.log("** File Parser Finished :" + result);


    } catch (error) {
        console.error("** Parser Error:", error)
        return { statusCode: 500, body: "Internal server error:" + error };
    }


};

export const main = middyfy(importFileParser);