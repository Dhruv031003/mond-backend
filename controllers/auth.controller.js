import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.models.js";
dotenv.config();

const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(400).json({ message: "Access Token is required" });

    const accessToken = authHeader.split(" ")[1];
    const decodeToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    if (!decodeToken.userId)
      return res.status(401).json({ message: "Invalid Access Token" });

    const user = await User.findById(decodeToken.userId);
    if (!user) return res.status(401).json({ message: "Invalid Access Token" });

    req.user=user
    next()
  } catch (error) {
    console.log("auth error", error);
    return res.status(401).json({"message":"Invalid Access Token"});
  }
};

export default verifyAuth;