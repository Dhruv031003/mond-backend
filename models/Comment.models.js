import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ----------- Polymorphic reference for Post or Reel -----------
    commentableId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    commentableType: {
      type: String,
      enum: ["Post", "Reel"],
      required: true,
    },

    // ----------- For replies (second level only) -----------
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // null means TOP LEVEL comment
    },

    // ----------- Likes -----------
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;