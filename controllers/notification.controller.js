import mongoose from "mongoose";
import Notification from "../models/Notification.models.js";

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }
    const notif = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user._id, isRead: false },
      { isRead: true },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Marked as read", notification: notif });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = req.query.limit || 20;
    const cursor = req.query.cursor;
    const type= req.query.type
    const event= req.query.event

    const query = { userId };

    if (cursor) {
      query._id = { $lt: cursor };
    }
    if (type) {
      query.type = type;
    }
    if (event) {
      query["data.event"] = event;
    }

    const notifications = await Notification.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .select("title body isRead createdAt data type")
      .lean();

    const nextCursor =
      notifications.length > 0
        ? notifications[notifications.length - 1]._id
        : null;
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });
    return res.json({
      unreadCount,
      notifications,
      nextCursor,
    });
  } catch (error) {
    console.log("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
