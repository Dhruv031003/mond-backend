import Reel from "../models/Reel.models.js";

const getAllReels = async (req, res) => {
  try {
    const user = req.user;
    const allReels = await Reel.find({ userId: user._id });
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
    return res.status(200).json({ message: "success", reel });
  } catch (error) {
    console.log("error while fetching single reel", error);
    return res.status(500).json({ message: "Couldn't fetch reel" });
  }
};

const createReel = async (req, res) => {
  try {
    const { description, location, isArchived, hashTags, fileType,objectURL } = req.body;
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
