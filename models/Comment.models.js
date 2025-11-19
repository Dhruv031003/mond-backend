import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ----------- Polymorphic reference for Post or Reel -----------
    objectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    objectType: {
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
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;