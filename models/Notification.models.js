import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, default: "general", index: true },
  data: {
    type: Object,
    default: {},
  },
  deliveredTo: [
    {
      deviceId: String,
      fcmToken: String,
      deliveredAt: Date,
    },
  ],
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
});

notificationSchema.index({ userId: 1, _id: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
