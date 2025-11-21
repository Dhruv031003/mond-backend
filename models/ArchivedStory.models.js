import mongoose from "mongoose";

const archivedStorySchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    objectURL: String,
    fileType: String,

    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true,versionKey: false }
);

const ArchivedStory= mongoose.model("ArchivedStory", archivedStorySchema);
export default ArchivedStory