import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.models.js";
import Session from "../models/Session.models.js";

dotenv.config();

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(400).json({ message: "Access Token is required" });

    const accessToken = authHeader.split(" ")[1];

    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired Access Token" });
    }
    if (!decodedToken.userId || !decodedToken.sessionId)
      return res.status(401).json({ message: "Invalid Access Token" });

    const user = await User.findById(decodedToken.userId);
    if (!user) return res.status(401).json({ message: "Invalid Access Token" });
    
    const session = await Session.findOne({
      sessionId: decodedToken.sessionId,
      userId: decodedToken.userId,
      isActive: true,
    });
    if (!session)
      return res.status(401).json({ message: "Session is no longer active" });

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    console.log("auth error", error);
    return res.status(401).json({ message: "Invalid Access Token" });
  }
};

export default verifyUser;
