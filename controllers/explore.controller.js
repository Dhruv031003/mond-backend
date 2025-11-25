import Reel from "../models/Reel.models.js";
import Post from "../models/Post.models.js";

const getExplore = async (req, res) => {
  try {
    const reels = await Reel.aggregate([
      {
        $match: {
          isDeleted: false,
          isArchived: false,
        },
      },
      {
        $match: {
          userId: { $ne: req.user._id },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          "user.isPrivate": false,
        },
      },
      { $sample: { size: 10 } },
      {
        $project: {
          _id: 1,
          likeCount: 1,
          commentCount: 1,
          fileType: 1,
          objectURL: 1,
          type: { $literal: "reel" },
        },
      },
    ]);

    const posts = await Post.aggregate([
      {
        $match: {
          isDeleted: false,
          isArchived: false,
        },
      },
      {
        $match: {
          userId: { $ne: req.user._id },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          "user.isPrivate": false,
        },
      },
      { $sample: { size: 10 } },
      {
        $project: {
          _id: 1,
          likeCount: 1,
          commentCount: 1,
          fileType: 1,
          objectURL: 1,
          type: { $literal: "post" },
        },
      },
    ]);

    // Combine
    const combined = [...posts, ...reels];

    // Shuffle (Fisher-Yates)
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return res.status(200).json({ message: "Success", data: combined });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export { getExplore };
