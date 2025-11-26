import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAccessToken = (userId,sessionId) => {
  return jwt.sign({ userId,sessionId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
};
const generateRefreshToken = (userId,sessionId) => {
  return jwt.sign({ userId,sessionId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });
};

const hashRefreshToken = async (refreshToken) => {
  return await bcrypt.hash(refreshToken, 10);
};

const compareToken = async (rawToken, hashedToken) => {
  return await bcrypt.compare(rawToken, hashedToken);
};

export { generateAccessToken, generateRefreshToken, hashRefreshToken ,compareToken};
