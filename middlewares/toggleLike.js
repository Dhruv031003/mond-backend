import Like from "../models/Like.models.js";
import Post from "../models/Post.models.js";
import Reel from "../models/Reel.models.js";
import Story from "../models/Story.models.js";
import Thread from "../models/Thread.models.js";

const MODELS = {
  post: Post,
  reel: Reel,
  story: Story,
  thread: Thread,
};

export const toggleLike = async (req, res) => {
  try {
    const { objectId, objectType } = req.body;
    const userId = req.user._id;
    if (!MODELS[objectType]) {
      return res.status(400).json({ message: "Incorrect object type" });
    }

    let existing = await Like.findOne({ objectId, objectType, userId });
    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      await MODELS[objectType].findByIdAndUpdate(objectId, {
        $inc: { likeCount: -1 },
      });
      return res.status(200).json({ message: "success", liked: false });
    } else {
      await Like.create({ objectId, objectType, userId });
      await MODELS[objectType].findByIdAndUpdate(objectId, {
        $inc: { likeCount: 1 },
      });
      return res.status(200).json({ message: "success", liked: true });
    }
  } catch (error) {
    console.log("Error while liking", error);
    return res.status(500).json({ message: "Error while liking" });
  }
};
