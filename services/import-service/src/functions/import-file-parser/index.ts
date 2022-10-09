import { handlerPath } from '@libs/handler-resolver';
import dotenv from 'dotenv';
dotenv.config();
const { BUCKET_NAME } = process.env;

export default {
    handler: `${handlerPath(__dirname)}/importFileParser.main`,
    events: [
        {
            s3: {
                bucket: BUCKET_NAME,
                event: 's3:ObjectCreated:*',
                rules: [{
                    prefix: 'uploaded/',
                },
                {
                    suffix: '.csv'
                }],
                existing: true
            }
        },
    ],
};