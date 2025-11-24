import Reel from "../models/Reel.models.js";
import User from "../models/User.models.js";
import Follow from "../models/Follow.models.js";

const getAllReels = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = req.user;
    if (!userId) {
      const allReels = await Reel.find({ userId: user._id });
      return res.status(200).json({ message: "success", allReels });
    }

    const userDetails = await User.findById(userId).select("isPrivate");
    if (!userDetails) {
      return res
        .status(400)
        .json({ message: "Couldn't find a user with the given id" });
    }

    const isFollower = await Follow.findOne({
      isConfirmed: true,
      followingId: userId,
      followerId: user._id,
    });
    if (!isFollower && userDetails.isPrivate) {
      return res.status(400).json({ message: "You're not a follower" });
    }

    const allReels = await Reel.find({ userId, isArchived: false});
    return res.status(200).json({ message: "success", allReels });
  } catch (error) {
    console.log("error while fetching all reels", error);
    return res.status(500).json({ message: "Couldn't fetch all reels" });
  }
};

const getReel = async (req, res) => {
  try {
    const { reelId } = req.params;
    const user = req.user;
    const reel = await Reel.findById(reelId);

    if (!reel)
      return res.status(404).json({ message: "This reel doesn't exists" });

    if (reel.userId.toString() === user._id.toString())
      return res.status(200).json({ message: "Reel fetched!!", reel });
    if (reel.isArchived)
      return res.status(400).json({ message: "Reel not found!!!" });

    const userDetails = await User.findById(reel.userId).select("isPrivate");

    const isFollower = await Follow.findOne({
      isConfirmed: true,
      followerId: user._id,
      followingId: reel.userId,
    });
    if (!isFollower && userDetails.isPrivate)
      return res.status(400).json({ message: "You're not a follower" });

    return res.status(200).json({ message: "success", reel });
  } catch (error) {
    console.log("error while fetching single reel", error);
    return res.status(500).json({ message: "Couldn't fetch reel" });
  }
};

const createReel = async (req, res) => {
  try {
    const { description, location, isArchived, hashTags, fileType, objectURL } =
      req.body;
    const user = req.user;
    const reel = await Reel.create({
      userId: user._id,
      description,
      location,
      fileType,
      isArchived: isArchived ?? false,
      hashTags: hashTags ?? [],
      objectURL: objectURL ?? null,
    });
    return res.status(200).json({ message: "success", reel });
  } catch (error) {
    console.log("Error while creating reel", error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export { createReel, getReel, getAllReels };
