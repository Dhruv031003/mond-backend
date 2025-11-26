import Notification from "../models/Notification.models.js";
import Session from "../models/Session.models.js";
import { fcm } from "../configs/firebase.js";

export const sendNotification = async (
  userId,
  title,
  body,
  type = "general",
  data = {}
) => {
  try {
    const sessions = await Session.find({ userId, isActive: true }).select(
      "deviceId fcmToken"
    );

    if (sessions.length === 0) {
      console.log("No active sessions or device tokens.");
      return { message: "No devices", successCount: 0, failureCount: 0 };
    }

    const tokens = sessions
      .map((s) => s.fcmToken)
      .filter((t) => t && t.trim().length > 0);

    if (tokens.length === 0) {
      return;
    }

    const message = {
      notification: { title, body },
      data: {
        type,
        ...Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, String(v)])
        ),
      },
      tokens,
    };

    const response = await fcm.sendEachForMulticast(message);

    const deliveredTo = sessions.map((s) => ({
      deviceId: s.deviceId,
      fcmToken: s.fcmToken,
      deliveredAt: new Date(),
    }));

    const notification = new Notification({
      userId,
      title,
      body,
      data,
      type,
      deliveredTo,
    });

    await notification.save();

    return {
      notification,
      fcmReport: response,
    };
  } catch (error) {
    console.error("Notification Error:", error);
    throw error;
  }
};
