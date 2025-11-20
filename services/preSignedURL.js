import AWS from "aws-sdk";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const folderMap = {
      profile: "profilePics",
      post: "posts",
      chat: "chats",
      reel:"reels",
      thread:"threads",
      story:"stories"
    };

const s3 = new AWS.S3({
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.CF_ACCESS_KEY_ID,
  secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "auto",
});

const getPreSignedURL = async (req, res) => {
  try {
    const { fileName, fileType, uploadedFrom } = req.body;
    console.log(fileName, fileType);

    if (!fileName || !fileType || !uploadedFrom)
      return res
        .status(400)
        .json({ message: "FileName, filetype and folder are required" });

    
    const folderName = folderMap[uploadedFrom];
    if (!folderName)
      return res
        .status(400)
        .json({ message: "cannot upload photos from here" });

    const ext = fileName.split(".").pop();
    const randomHash = crypto.randomBytes(8).toString("hex");
    const timestamp = Date.now();

    const finalFileName = `${timestamp}_${randomHash}.${ext}`;

    const params = {
      Bucket: process.env.CF_BUCKET_NAME,
      Key: `${folderName}/${finalFileName}`,
      Expires: 60,
      ContentType: fileType,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);

    const publicURL = `${process.env.CF_DEV_PUBLIC_URL}/${folderName}/${finalFileName}`;

    return res.status(200).json({ message: "success", uploadURL, publicURL });
  } catch (error) {
    console.log("Presigned url error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getPreSignedURL;
