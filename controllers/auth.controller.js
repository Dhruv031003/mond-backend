import User from "../models/User.models.js";
import axios from "axios";
import { oauth2Client } from "../configs/googleConfig.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateAccess&RefreshToken.js";

dotenv.config();

const logoutHandler = async (req, res) => {
  try {
    const user = req.user;
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({ message: "logout successful" });
  } catch (error) {
    console.log(error, "Logout error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const emailLoginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
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
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "Successful login",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error, "email login error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const emailRegisterHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user already exists with the following email" });
    }
    const user = new User({ email, password });
    await user.save();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return res.status(201).json({
      message: "registration successful!!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error, "email registere error");
    res.status(500).json({ message: "internal server error" });
  }
};

const phoneLoginHandler = async (req, res) => {
  try {
    const { phoneNo, password } = req.body;
    const user = await User.findOne({ phoneNo }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist with this phone number" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "Successful login",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error, "phone login error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const phoneRegisterHandler = async (req, res) => {
  try {
    const { phoneNo, password } = req.body;
    const existingUser = await User.findOne({ phoneNo });
    if (existingUser) {
      return res.status(400).json({
        message: "A user already exists with the following phone number",
      });
    }

    const user = new User({ phoneNo, password });
    await user.save();
    // const token = crypto.randomBytes(32).toString("hex");
    // await redisClient.set(`verify:${token}`, email, { EX: 30 });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "registration successful!!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error, "phone register error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const oAuthHandler = async (req, res) => {
  try {
    const { code, idToken } = req.body;
    console.log(code);
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
      user = new User({ email, name, image: picture });
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ message: "Login successfull", accessToken, refreshToken });
  } catch (error) {
    console.log("oauth login error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshAccessTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "access token is required" });

    const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    if (user.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Invalid Token" });

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res.send({
      message: "Tokens refreshed!",
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
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
};
