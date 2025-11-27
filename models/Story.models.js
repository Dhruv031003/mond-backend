import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    objectURL: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000),
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
    allowedToView: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    archivedAt: {
      type: Date,
      default: null,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

storySchema.index({ userId: 1, isArchived: 1, expiresAt: 1 });

const Story = mongoose.model("Story", storySchema);

export default Story;
