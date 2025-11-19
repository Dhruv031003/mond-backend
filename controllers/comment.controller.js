import Comment from "../models/Comment.models.js";

export const createComment = async (req, res) => {
  try {
    const { content, commentableId, commentableType, parentComment } = req.body;

    if (!["Post", "Reel"].includes(commentableType)) {
      return res.status(400).json({ message: "Invalid commentable type" });
    }

    // Parent comment provided → this is a REPLY
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json({ message: "Parent comment not found" });
      }

      // Only allow one level of replies
      if (parent.parentComment !== null) {
        return res
          .status(400)
          .json({ message: "Only one level of replies is allowed" });
      }
    }

    const comment = await Comment.create({
      content,
      commentableId,
      commentableType,
      parentComment: parentComment || null,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { commentableId, commentableType, limit = 10, cursor } = req.query;

    const query = {
      commentableId,
      commentableType,
      parentComment: null, // ONLY TOP LEVEL COMMENTS
    };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    let comments = await Comment.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit) + 1)
      .populate("user", "username avatar");

    let hasMore = false;
    let nextCursor = null;

    if (comments.length > limit) {
      hasMore = true;
      nextCursor = comments[limit]._id;
      comments.pop();
    }

    // Add total likes and total replies to each comment
    comments = await Promise.all(
      comments.map(async (c) => {
        const repliesCount = await Comment.countDocuments({
          parentComment: c._id,
        });

        return {
          ...c.toObject(),
          totalLikes: c.likes.length,
          totalReplies: repliesCount,
        };
      })
    );

    res.json({ comments, nextCursor, hasMore });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getReplies = async (req, res) => {
  try {
    const { parentComment, limit = 10, cursor } = req.query;

    const query = { parentComment };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    let replies = await Comment.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit) + 1)
      .populate("user", "username avatar");

    let hasMore = false;
    let nextCursor = null;

    if (replies.length > limit) {
      hasMore = true;
      nextCursor = replies[limit]._id;
      replies.pop();
    }

    replies = replies.map((r) => ({
      ...r.toObject(),
      totalLikes: r.likes.length,
    }));

    res.json({ replies, nextCursor, hasMore });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const c = await Comment.findById(commentId);

    if (!c) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = c.likes.includes(userId);

    if (alreadyLiked) {
      c.likes.pull(userId);
    } else {
      c.likes.push(userId);
    }

    await c.save();

    res.json({
      message: alreadyLiked ? "Unliked" : "Liked",
      totalLikes: c.likes.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// export {createComment,getAllComments}