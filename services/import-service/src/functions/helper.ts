//End of the stream the lambda function should move the file
export const copySourceTo = (bucketName: string, key: string, from: string, to: string) => {
    return {
        Bucket: bucketName,
        CopySource: `${bucketName}/${key}`,
        Key: key.replace(from, to)
    }
};