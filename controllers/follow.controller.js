import Follow from "../models/Follow.models.js";
import { sendNotification } from "../services/sendNotification.js";

export const toggleFollow = async (req, res) => {
  try {
    const { followingId } = req.params;
    const user = req.user;

    if (!followingId)
      return res.status(400).json({ message: "User id needed" });

    const isFollowing = await Follow.findOne({
      followingId,
      followerId: user._id,
    });

    if (isFollowing) {
      await Follow.deleteOne({ _id: isFollowing._id });
      return res
        .status(200)
        .json({ message: "follow request cancelled!!", following: false });
    }
    const followRequest = await Follow.create({
      followingId,
      followerId: user._id,
    });

    res.on("finish", async () => {
  await sendNotification(
    followingId,
    "New Follow Request",
    `${user.username} has sent you a follow request.`,
    "followRequest",
    { followerId: user._id.toString() }
  );
});

    return res
      .status(200)
      .json({ message: "Follow request send successfully!!", followRequest });
  } catch (error) {
    console.log(error, "error while follwiing");
    return res.status(500).json({ message: "Internal sever errro" });
  }
};

export const getFollowersAndFollowingCount = async (req, res) => {
  try {
    let { userId } = req.query;
    if (!userId) {
      userId = req.user?._id;
    }

    const countFollowers = await Follow.countDocuments({
      followingId: userId,
      isConfirmed: true,
    });
    const countFollowing = await Follow.countDocuments({
      followerId: userId,
      isConfirmed: true,
    });

    return res.status(200).json({
      userId,
      followersCount: countFollowers,
      followingCount: countFollowing,
    });
  } catch (error) {
    console.log("error while fetching followercount", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getFollowRequests = async (req, res) => {
  const userId = req.user?._id;
  const followRequests = await Follow.find({
    followingId: userId,
    isConfirmed: false,
  });
  return res.status(200).json({
    message: "Follow requests fetched successfullly!!!",
    followRequests,
  });
};

export const acceptFollowRequest = async (req, res) => {
  const { followRequestId } = req.params;
  if (!followRequestId)
    return res.status(400).json({ message: "follow request id is required" });

  const followRequest = await Follow.findById(followRequestId);
  if (!followRequest)
    return res.status(300).json({ message: "No follow request exists" });
  followRequest.isConfirmed = true;
  await followRequest.save();

  return res
    .status(200)
    .json({ message: "Follow request accepted", followRequest });
};

export const getFollowersList = async (req, res) => {
  try {
    let { userId } = req.query;
    if (!userId) {
      userId = req.user?._id;
    } else {
      const isFollower = await Follow.findOne({
        followerId: req.user._id,
        followingId: userId,
        isConfirmed: true,
      });

      if (!isFollower)
        return res.status(400).json({ message: "you are not a follower" });
    }

    const followersList = await Follow.find({
      followingId: userId,
      isConfirmed: true,
    });
    return res.status(200).json({
      message: "success",
      followersList,
    });
  } catch (error) {
    console.log("error while fetching followers list", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getFollowingList = async (req, res) => {
  try {
    let { userId } = req.query;
    if (!userId) {
      userId = req.user?._id;
    } else {
      const isFollower = await Follow.findOne({
        followerId: req.user._id,
        followingId: userId,
        isConfirmed: true,
      });

      if (!isFollower)
        return res.status(400).json({ message: "you are not a follower" });
    }

    const followingList = await Follow.find({
      followerId: userId,
      isConfirmed: true,
    });
    return res.status(200).json({
      message: "success",
      followingList,
    });
  } catch (error) {
    console.log("error while fetching followers list", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
