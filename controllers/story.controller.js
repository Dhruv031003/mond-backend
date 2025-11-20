import Story from "../models/Story.models.js";
import ArchivedStory from "../models/ArchivedStory.models.js";
import mongoose from "mongoose";

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

    await ArchivedStory.create({
      storyId: story._id,
      userId,
      objectURL,
      fileType,
      mentions: story.mentions,
      createdAt: story.createdAt,
    });

    res.status(201).json({ message: "Story created", storyId: story._id });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserStories = async (req, res) => {
  try {
    const user = req.user;
    let { userId } = req.query;

    if (!userId) userId = user._id;

    const stories = await Story.find({ userId })
      .sort({ createdAt: -1 })
      .populate("mentions", "name profilePic _id")
      .populate("userId", "name profilePic _id");

    res.json({ stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;

    if (!storyId) {
      return res.status(400).json({ message: "Story ID is required" });
    }

    const story = await Story.findOne({
      _id: storyId,
      expiresAt: { $gt: new Date() }, // Active story only
    })
      .populate("userId", "name profilePic _id")
      .populate("mentions", "name profilePic _id");

    if (!story) {
      return res.status(404).json({
        message: "Story not found or expired",
      });
    }

    return res.status(200).json({
      message: "Story found",
      story
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// GET /story/archived/:id

export const getSingleArchivedStory = async (req, res) => {
  try {
    const id = req.params.id; // can be archiveId OR storyId
    const userId = req.user?._id;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    let archived;

    // A: Try archive _id
    archived = await ArchivedStory.findOne({
      _id: id,
      userId,
    })
      .populate("userId", "name profilePic _id")
      .populate("mentions", "name profilePic _id");

    // B: Try original storyId if not found
    if (!archived) {
      archived = await ArchivedStory.findOne({
        storyId: id,
        userId,
      })
        .populate("userId", "name profilePic _id")
        .populate("mentions", "name profilePic _id");
    }

    if (!archived) {
      return res.status(404).json({ message: "Archived story not found" });
    }

    return res.status(200).json({
      message: "Archived story found",
      story: archived,
      archived: true,
    });
  } catch (error) {
    console.error("Error fetching archived story:", error);
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
    const archived = await ArchivedStory.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ archived });
  } catch (error) {
    console.error("Error fetching archive:", error);
    res.status(500).json({ message: "Server error" });
  }
};
