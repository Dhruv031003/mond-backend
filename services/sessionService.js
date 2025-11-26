import mongoose from "mongoose";
import Session from "../models/Session.models.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/access&RefreshToken.js";

export const createSessionAndTokens = async (
  user,
  deviceId,
  userAgent = "unknown",
  ipAddress = "unknown",
  fcmToken = null
) => {
  let session = await Session.findOne({ userId: user._id, deviceId });

  if (session) {
    session.userAgent = userAgent;
    session.ipAddress = ipAddress;
    session.fcmToken = fcmToken || session.fcmToken;
    session.isActive = true;
    await session.save();
  } else {
    session = new Session({
      userId: user._id,
      sessionId: new mongoose.Types.ObjectId().toString(),
      deviceId,
      userAgent,
      ipAddress,
      fcmToken,
      isActive: true,
    });
  }

  const accessToken = generateAccessToken(user._id, session.sessionId);
  const refreshToken = generateRefreshToken(user._id, session.sessionId);
  const hashedRefreshToken = await hashRefreshToken(refreshToken);
  session.refreshTokenHash = hashedRefreshToken;
  await session.save();

  return {
    accessToken,
    refreshToken,
    session,
  };
};
