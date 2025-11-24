import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/User.models.js";
import Story from "./models/Story.models.js";

dotenv.config();

async function migrate() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("🚀 Running User + Story migration...");

    const userResult = await User.updateMany(
      { $or: [{ isPrivate: { $exists: false } }, { isPrivate: null }] },
      { $set: { isPrivate: true } }
    );

    console.log(`✔ User migration done → Updated: ${userResult.modifiedCount}`);


    // ================================
    // STORY MODEL FIX
    // ================================
    const allStories = await Story.find();

    let updated = 0;

    for (const story of allStories) {
      let needsUpdate = false;

      // (1) Likes → likeCount
      if (story.likes) {
        story.likeCount = story.likes.length;
        story.likes = undefined;
        needsUpdate = true;
      }

      // (2) isArchived
      if (story.isArchived === undefined) {
        story.isArchived = false;
        needsUpdate = true;
      }

      // (3) isHighlighted
      if (story.isHighlighted === undefined) {
        story.isHighlighted = false;
        needsUpdate = true;
      }

      // (4) allowedToView
      if (!story.allowedToView) {
        story.allowedToView = [];
        needsUpdate = true;
      }

      // (5) archivedAt
      if (story.archivedAt === undefined) {
        story.archivedAt = null;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await story.save();
        updated++;
      }
    }

    console.log(`✔ Story migration done → Updated: ${updated}`);

    console.log("🎉 Migration complete!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
