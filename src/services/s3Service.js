import { Auth } from "aws-amplify";
import { S3Client, PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";

const REGION = "your-region";

const getS3Client = async () => {
  const credentials = await Auth.currentCredentials();
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  });
};

export const createBucket = async (bucketName) => {
  try {
    const s3Client = await getS3Client();
    const command = new CreateBucketCommand({ Bucket: bucketName });
    await s3Client.send(command);
    console.log(`Bucket ${bucketName} created successfully.`);
  } catch (err) {
    console.error("Error creating bucket:", err);
  }
};

export const uploadFile = async (bucketName, file) => {
  try {
    const s3Client = await getS3Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: file.name,
      Body: file,
    });
    await s3Client.send(command);
    console.log(`${file.name} uploaded successfully.`);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};
