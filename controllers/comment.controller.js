import Comment from "../models/Comment.models.js";

export const createComment = async (req, res) => {
  try {
    const { text, objectId, objectType, parentComment } = req.body;

    if (!["Post", "Reel"].includes(objectType)) {
      return res.status(400).json({ message: "Invalid object type" });
    }

    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json({ message: "Parent comment not found" });
      }

      if (parent.parentComment !== null) {
        return res
          .status(400)
          .json({ message: "Only one level of replies is allowed" });
      }
    }

    const comment = await Comment.create({
      text,
      objectId,
      objectType,
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
    const { objectId, objectType, limit = 10, cursor } = req.query;
    
    if(!objectId || !objectType){
      return res.status(400).json({ message: "objectId and objectType are required" });
    }
    if(limit>20){
      return res.status(400).json({ message: "Limit cannot exceed 20" });
    }

    const query = {
      objectId,
      objectType,
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
      .limit(Number(limit) + 1)   // Fetch one extra
      .populate("user", "username avatar");

    let hasMore = false;
    let nextCursor = null;

    if (replies.length > limit) {
      hasMore = true;

      // FIX: cursor should be the LAST item of the returned batch
      nextCursor = replies[limit - 1]._id;

      // Remove extra item
      replies = replies.slice(0, limit);
    }

    replies = replies.map((r) => ({
      ...r.toObject(),
      totalLikes: r.likes.length,
    }));

    res.json({ replies, nextCursor, hasMore });
  } catch (error) {
    console.error(error);
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