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

    ObjectUrl: String,
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

const ArchivedStory= mongoose.model("ArchiveStory", archivedStorySchema);
export default ArchivedStory