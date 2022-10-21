import csv from 'csv-parser';
import { S3, SQS } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { S3Event } from 'aws-lambda';
import { copySourceTo } from '../helper';

import dotenv from 'dotenv';
dotenv.config();

const { REGION, BUCKET_NAME, SOURCE_FOLDER, TARGET_FOLDER, SQS_QUEUE_URL } = process.env;

export const importFileParser = async (event: S3Event) => {
    console.log(`** FileParser Event : ${JSON.stringify(event)}`);

    try {
        const s3 = new S3({ region: REGION });
        const sqs = new SQS({ region: REGION });

        const key = event.Records?.[0]?.s3?.object?.key;
        if (!key) {
            return { statusCode: 400, body: "File Not Found" };
        };

        console.log("** File:", key);

        if (!key.endsWith(".csv")) {
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
                .pipe(csv())
                .on("error", (error: any) => {
                    console.error("**  Error:", error)
                    reject(error)
                })
                .on("data", (data: any) => {
                    console.log("** Data:", data)
                    sqs.sendMessage({
                        QueueUrl: SQS_QUEUE_URL || '',
                        MessageBody: JSON.stringify(data)
                    }, (err, data) => {
                        if (err) console.error('** sendMessage error:', err);
                        console.log('** sendMessage data:', data);
                    });
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