import User from "../models/User.models.js";
import Session from "../models/Session.models.js";

import axios from "axios";
import { oauth2Client } from "../configs/googleConfig.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  compareToken,
} from "../utils/access&RefreshToken.js";

import { createSessionAndTokens } from "../services/sessionService.js";

dotenv.config();

const logoutHandler = async (req, res) => {
  try {
    const { refreshToken, sessionId } = req.body;

    if (!refreshToken || !sessionId) {
      return res
        .status(400)
        .json({ message: "refresh token and session id are required" });
    }

    await Session.findOneAndUpdate(
      { sessionId, userId: req.user._id },
      { isActive: false }
    );

    return res.status(200).json({ message: "logout successful" });
  } catch (error) {
    console.log(error, "Logout error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutFromAllDevicesHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    await Session.deleteMany({ userId });
    return res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    console.log(error, "Logout from all devices error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const emailLoginHandler = async (req, res) => {
  try {
    const { email, password, deviceId, fcmToken } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "Device ID is required" });
    }

    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.ip ||
      req.connection?.remoteAddress ||
      "unknown";

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist with this email" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentails" });
    }

    const { accessToken, refreshToken, session } = await createSessionAndTokens(
      user,
      deviceId,
      userAgent,
      ipAddress,
      fcmToken
    );

    return res.status(200).json({
      message: "Successful login",
      accessToken,
      refreshToken,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.log(error, "email login error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const emailRegisterHandler = async (req, res) => {
  try {
    const { email, password, deviceId, fcmToken } = req.body;

    if (!deviceId)
      return res.status(400).json({ message: "Device ID is required" });

    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      "unknown";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user already exists with the following email" });
    }

    const user = await User.create({ email, password });
    await user.save();

    const { accessToken, refreshToken, session } = await createSessionAndTokens(
      user,
      deviceId,
      userAgent,
      ipAddress,
      fcmToken
    );

    return res.status(201).json({
      message: "Registration successful!!",
      accessToken,
      refreshToken,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.log(error, "email register error");
    res.status(500).json({ message: "internal server error" });
  }
};

const phoneLoginHandler = async (req, res) => {
  try {
    const { phoneNo, password, deviceId, fcmToken } = req.body;
    if (!deviceId) {
      return res.status(400).json({ message: "Device ID is required" });
    }
    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      "unknown";

    const user = await User.findOne({ phoneNo }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist with this phone number" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken, session } = await createSessionAndTokens(
      user,
      deviceId,
      userAgent,
      ipAddress,
      fcmToken
    );

    return res.status(200).json({
      message: "Successful login",
      accessToken,
      refreshToken,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.log(error, "phone login error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const phoneRegisterHandler = async (req, res) => {
  try {
    const { phoneNo, password, deviceId, fcmToken } = req.body;
    if (!deviceId) {
      return res.status(400).json({ message: "Device ID is required" });
    }

    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      "unknown";

    const existingUser = await User.findOne({ phoneNo });
    if (existingUser) {
      return res.status(400).json({
        message: "A user already exists with the following phone number",
      });
    }

    const user = await User.create({ phoneNo, password });

    const { accessToken, refreshToken, session } = await createSessionAndTokens(
      user,
      deviceId,
      userAgent,
      ipAddress,
      fcmToken
    );

    return res.status(200).json({
      message: "Registration successful!!",
      accessToken,
      refreshToken,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.log(error, "phone register error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const oAuthHandler = async (req, res) => {
  try {
    const { code, idToken, deviceId, fcmToken } = req.body;
    if (!deviceId) {
      return res.status(400).json({ message: "Device ID is required" });
    }
    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      "unknown";

    let userInfo;

    if (idToken) {
      const ticket = await oauth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOOGLE_CLIENT_ID,
      });
      userInfo = ticket.getPayload();
    } else if (code) {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${tokens.access_token}`
      );
      userInfo = response.data;
    } else {
      return res.status(401).json({ message: "Code or Id token is required" });
    }
    const { email, name, picture } = userInfo;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, image: picture });
    }

    const { accessToken, refreshToken, session } = await createSessionAndTokens(
      user,
      deviceId,
      userAgent,
      ipAddress,
      fcmToken
    );

    res.status(200).json({
      message: "Login successfull",
      accessToken,
      refreshToken,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.log("oauth login error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshAccessTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(400)
        .json({ message: "refresh token is required" });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const session = await Session.findOne({
      sessionId:decoded.sessionId,
      userId: decoded.userId,
      isActive: true,
    });
    if (!session) {
      return res
        .status(401)
        .json({ message: "Refresh token does not match any active session" });
    }

    const isValid = await compareToken(refreshToken, session.refreshTokenHash);
    if (!isValid) {
      return res.status(401).json({ message: "Refresh token does not match" });
    }

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);
    const newRefreshTokenHash = await hashRefreshToken(newRefreshToken);

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    return res.status(200).json({
      message: "Tokens refreshed!",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.log("error refreshing token", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  oAuthHandler,
  emailLoginHandler,
  emailRegisterHandler,
  phoneLoginHandler,
  phoneRegisterHandler,
  refreshAccessTokenHandler,
  logoutHandler,
  logoutFromAllDevicesHandler
};
