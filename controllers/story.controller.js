import Story from "../models/Story.models.js";
import User from "../models/User.models.js";
import Follow from "../models/Follow.models.js";

export const createStory = async (req, res) => {
  try {
    const { objectURL, fileType, mentions } = req.body;
    const userId = req.user._id;

    if (!objectURL || !fileType) {
      return res.status(400).json({ message: "Missing objectUrl or fileType" });
    }

    const story = await Story.create({
      userId,
      objectURL,
      fileType,
      mentions: mentions || [],
    });

    res.status(201).json({ message: "Story created", storyId: story._id });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getActiveStories = async (req, res) => {
  try {
    let { userId } = req.query;
    const user = req.user;

    if (!userId) {
      const activeStories = await Story.find({
        userId: user._id,
        isArchived: false,
        isDeleted:false,
        expiresAt: { $gt: new Date() },
      })
        .sort({ createdAt: -1 })
        .populate("mentions", "name profilePic _id")
        .populate("userId", "name profilePic _id");
      return res.json({
        message: "Stories Fetched!!!",
        stories: activeStories,
      });
    }

    const userDetails = await User.findById(userId).select("isPrivate");
    if (!userDetails) {
      return res
        .status(400)
        .json({ message: "Couldn't find a user with the given id" });
    }

    const isFollower = await Follow.findOne({
      isConfirmed: true,
      followingId: userId,
      followerId: user._id,
    });
    if (!isFollower && userDetails.isPrivate) {
      return res.status(400).json({ message: "You're not a follower" });
    }

    const activeStories = await Story.find({
      userId,
      isArchived: false,
      isDeleted:false,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .populate("mentions", "name profilePic _id")
      .populate("userId", "name profilePic _id");
    return res.json({ message: "Stories Fetched!!!", stories: activeStories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const user = req.user;

    if (!storyId) {
      return res.status(400).json({ message: "Story ID is required" });
    }

    const story = await Story.findById(storyId)
      .populate("userId", "name profilePic _id")
      .populate("mentions", "name profilePic _id");

    if (!story || story.isDeleted) {
      return res.status(404).json({
        message: "Story not found or expired",
      });
    }

    if (story.userId._id.toString() === user._id.toString())
      return res.status(200).json({ message: "story found!!", story });

    const userDetails = await User.findById(story.userId._id).select(
      "isPrivate"
    );

    const isFollower = await Follow.findOne({
      isConfirmed: true,
      followerId: user._id,
      followingId: story.userId._id,
    });

    const isAllowed = story.allowedToView.some(
      (allowedUserId) => allowedUserId.toString() === user._id.toString()
    );

    if (!isFollower && userDetails.isPrivate && !isAllowed)
      return res.status(400).json({ message: "You're not a follower" });

    return res.status(200).json({
      message: "Story found",
      story,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const toggleLikeStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const alreadyLiked = story.likes.includes(userId);

    if (alreadyLiked) {
      story.likes.pull(userId);
    } else {
      story.likes.push(userId);
    }

    await story.save();

    res.json({
      liked: !alreadyLiked,
      totalLikes: story.likes.length,
    });
  } catch (error) {
    console.error("Error liking story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getArchivedStories = async (req, res) => {
  try {
    const archived = await Story.find({
      userId: req.user._id,
      isArchived: true,
    }).sort({ createdAt: -1 });

    res.json({ message: "Stories found!!!", archived });
  } catch (error) {
    console.error("Error fetching archive:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getHighlights = async (req, res) => {
  const { userId } = req.query;
  const user = req.user;
  if (!userId) {
    const highlights = await Story.find({
      userId,
      isHighlighted: true,
    }).populate("mentions", "name profilePic _id");
  }
};