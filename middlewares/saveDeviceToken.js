import User from "../models/User.models.js"

export const saveDeviceToken = async (req, res) => {
  try {
    const user = req.user;
    const { token } = req.body;

    if (!token)
      return res.status(400).json({ message: "Device token missing" });

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { deviceTokens: token },
    });

    res.json({ message: "Token saved" });
  } catch (error) {
    console.error("Save token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
