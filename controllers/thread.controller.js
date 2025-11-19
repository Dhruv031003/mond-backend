import Thread from "../models/Thread.models.js";
import mongoose from "mongoose";

const getReplies = async (req, res) => {
  try {
    const { threadId } = req.params;
    const limit = Number(req.query.limit) || 10;
    const after = req.query.after;

    const filter = { parent_thread_id: threadId };

    if (after) {
      filter._id = { $gt: new mongoose.Types.ObjectId(after) };
    }

    const items = await Thread.find(filter)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean();

    let nextCursor = null;
    let hasMore = false;

    if (items.length > limit) {
      hasMore = true;
      nextCursor = items[limit]._id.toString();
      items.pop();
    }

    res.json({
      replies: items,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const includeParents = req.query.includeParents === "true";

    const thread = await Thread.findById(threadId)
      .populate(
        "userId",
        "-refreshToken -postCount -updatedAt -email -isPrivate -followersCount -links -isProfileCompleted -createdAt -__v"
      )
      .lean();

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    let parentChain = [];

    if (includeParents && thread.parent_thread_id) {
      let currentParent = thread.parent_thread_id;

      while (currentParent) {
        const parent = await Thread.findById(currentParent)
          .populate(
            "userId",
            "-refreshToken -postCount -updatedAt -email -isPrivate -followersCount -links -isProfileCompleted -createdAt -__v"
          )
          .lean();

        if (!parent) break;

        parentChain.unshift(parent);
        currentParent = parent.parent_thread_id;
      }
    }

    return res.status(200).json({
      thread,
      parentChain,
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
      userId: userId, // FIXED
      parent_thread_id: null, // only parent threads
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

    if (!text?.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    let thread_root_id = null;

    if (parent_thread_id) {
      const parent = await Thread.findById(parent_thread_id);
      if (!parent) {
        return res.status(404).json({ message: "Parent thread not found" });
      }

      thread_root_id = parent.thread_root_id || parent._id;

      await Thread.findByIdAndUpdate(parent_thread_id, {
        $inc: { replyCount: 1 },
      });
    }

    const thread = await Thread.create({
      userId: user._id,
      text: text.trim(),
      parent_thread_id: parent_thread_id || null,
      thread_root_id,
    });

    return res.status(201).json({ message: "Thread created", thread });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getThread, getAllThreads, createThread, getReplies };
