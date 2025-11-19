import Thread from "../models/Thread.models.js";
import mongoose from "mongoose";

const getReplies = async (req, res) => {
  try {
    const { threadId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const after = req.query.after;

    if (limit > 20) {
      return res.status(400).json({ message: "Limit cannot exceed 20" });
    }

    const filter = { parent_thread_id: threadId };

    if (after) {
      filter._id = { $gt: new mongoose.Types.ObjectId(after) };
    }

    const replies = await Thread.find(filter)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean();

    let nextCursor = null;
    let hasMore = false;

    if (replies.length > limit) {
      hasMore = true;
      nextCursor = replies[limit]._id.toString();
      replies.pop();
    }

    res.status(200).json({
      message: "successfully fetched",
      replies,
      nextCursor,
      hasMore: Boolean(nextCursor),
    });
  } catch (error) {
    console.error("cursor pagination error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getThread = async (req, res) => {
  try {
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId)
      .populate(
        "userId",
        "-refreshToken -postCount -updatedAt -email -isPrivate -followersCount -links -isProfileCompleted -createdAt -__v"
      )
      .lean();

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    return res.status(200).json({
      thread,
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllThreads = async (req, res) => {
  try {
    const userId = req.user?._id;
    const limit = parseInt(req.query.limit) || 10;
    const after = req.query.after;

    if (limit > 20) {
      return res.status(400).json({ message: "Limit cannot exceed 20" });
    }

    const filter = {
      userId: userId,           // FIXED
      parent_thread_id: null,   // only parent threads
    };

    if (after) {
      if (!mongoose.Types.ObjectId.isValid(after)) {
        return res.status(400).json({ message: "Invalid cursor" });
      }

      filter._id = { $lt: new mongoose.Types.ObjectId(after) };
    }

    const threads = await Thread.find(filter)
      .sort({ _id: -1 }) // newest first
      .limit(limit)
      .lean();

    const nextCursor = threads.length ? threads[threads.length - 1]._id : null;

    return res.json({
      threads,
      nextCursor,
      hasMore: Boolean(nextCursor),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const createThread = async (req, res) => {
  try {
    const { text, parent_thread_id } = req.body;
    const user = req.user;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text is required" });
    }

    let depth = 0;
    let thread_root_id = null;

    if (parent_thread_id) {
      const parentThread = await Thread.findById(parent_thread_id);

      if (!parentThread) {
        return res.status(404).json({ message: "Parent thread not found" });
      }

      if (parentThread.depth >= 2) {
        return res
          .status(400)
          .json({ message: "Replies allowed up to depth 2 only" });
      }

      depth = parentThread.depth + 1;

      thread_root_id = parentThread.thread_root_id || parent_thread_id;
    }

    const newThread = await Thread.create({
      userId: user._id,
      text,
      parent_thread_id: parent_thread_id || null,
      thread_root_id,
      depth,
    });

    return res.status(201).json({
      message: "Thread created successfully",
      thread: newThread,
    });
  } catch (error) {
    console.log("Error creating thread:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getThread, getAllThreads, createThread, getReplies };
