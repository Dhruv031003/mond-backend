import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();
const s3 = new AWS.S3({
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.CF_ACCESS_KEY_ID,
  secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "auto",
});

const getPreSignedURL = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    console.log(fileName,fileType)

    if (!fileName || !fileType)
      return res
        .status(400)
        .json({ message: "FileName and filetype are required" });
    
    const params = {
      Bucket: process.env.CF_BUCKET_NAME,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);

    const publicURL = `https://${process.env.CF_BUCKET_NAME}.${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`;

    return res.status(200).json({ message: "success", uploadURL,publicURL });
  } catch (error) {
    console.log("Presigned url error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getPreSignedURL;
