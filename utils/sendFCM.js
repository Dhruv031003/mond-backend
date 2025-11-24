import { fcm } from "../configs/firebase.js";
import User from "../models/User.models.js";

export const sendNotification = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findById(userId).select("deviceTokens");

    if (!user || user.deviceTokens.length === 0) {
      console.log("User has no device tokens");
      return;
    }

    const message = {
      notification: { title, body },
      data: { ...data },
      tokens: user.deviceTokens,
    };

    const response = await fcm.sendEachForMulticast(message);
    console.log("FCM sent:", response);
  } catch (error) {
    console.error("FCM Error:", error);
  }
};
