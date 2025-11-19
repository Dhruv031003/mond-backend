// import Story from "../models/Story.models.js";
// import ArchivedStory from "../models/archivedStory.models.js";

// /**
//  * POST /stories
//  * Upload new story → save to Story + Archive
//  */
// export const createStory = async (req, res) => {
//   try {
//     const { mediaUrl, mediaType, mentions } = req.body;
//     const userId = req.user._id;

//     if (!mediaUrl || !mediaType) {
//       return res.status(400).json({ message: "Missing mediaUrl or mediaType" });
//     }

//     // 1. Create story
//     const story = await Story.create({
//       user: userId,
//       mediaUrl,
//       mediaType,
//       mentions: mentions || [],
//     });

//     // 2. Archive immediately
//     await ArchiveStory.create({
//       storyId: story._id,
//       user: userId,
//       mediaUrl,
//       mediaType,
//       mentions: story.mentions,
//       createdAt: story.createdAt,
//     });

//     res.status(201).json({ message: "Story created", storyId: story._id });
//   } catch (error) {
//     console.error("Error creating story:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * GET /stories/user/:userId
//  * Fetch active (non-expired stories)
//  */
// export const getUserStories = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const stories = await Story.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .populate("mentions", "username avatar")
//       .populate("user", "username avatar");

//     res.json({ stories });
//   } catch (error) {
//     console.error("Error fetching stories:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * POST /stories/:id/like
//  * Toggle like on a story
//  */
// export const toggleLikeStory = async (req, res) => {
//   try {
//     const storyId = req.params.id;
//     const userId = req.user._id;

//     const story = await Story.findById(storyId);
//     if (!story) return res.status(404).json({ message: "Story not found" });

//     const alreadyLiked = story.likes.includes(userId);

//     if (alreadyLiked) {
//       story.likes.pull(userId);
//     } else {
//       story.likes.push(userId);
//     }

//     await story.save();

//     res.json({
//       liked: !alreadyLiked,
//       totalLikes: story.likes.length,
//     });
//   } catch (error) {
//     console.error("Error liking story:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * GET /archive
//  * Get archived stories
//  */
// export const getArchivedStories = async (req, res) => {
//   try {
//     const archived = await ArchiveStory.find({ user: req.user._id }).sort({
//       createdAt: -1,
//     });

//     res.json({ archived });
//   } catch (error) {
//     console.error("Error fetching archive:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
