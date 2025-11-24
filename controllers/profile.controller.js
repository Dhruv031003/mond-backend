import Follow from "../models/Follow.models.js";
import User from "../models/User.models.js";

const saveProfileDetails = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "bio",
      "location",
      "gender",
      "postsCount",
      "followersCount",
      "isPrivate",
      "profilePic",
      "isProfileCompleted",
    ];

    const user = req.user;

    allowedFields.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        user[field] = req.body[field];
      }
    });

    if (req.body.links && typeof req.body.links === "object") {
      if (!user.links) user.links = new Map(); // ensure map exists

      Object.entries(req.body.links).forEach(([key, value]) => {
        if (typeof value === "string") {
          user.links.set(key, value); // correct Map usage
        }
      });
    }

    await user.save();

    return res.status(200).json({ message: "Details updated successfully!" });
  } catch (error) {
    console.log("error while updating profile details", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    const userWithPassword = await User.findById(user._id).select("+password");
    const isMatch = await userWithPassword.comparePassword(oldPassword);

    if (!isMatch)
      return res.status(401).json({ message: "Enter correct password" });
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    return res.status(200).json({ message: "password change successful" });
  } catch (error) {
    console.log("error changing password");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProfileDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = req.user;
    if (!userId || userId.toString()===user._id.toString()) {
      return res.status(200).json({ message: "success", profile: user });
    }

    const userDetails = await User.findById(userId).select(
      "-refreshToken -isProfileCompleted -updatedAt -createdAt -__v0 -email"
    );
    if (!userDetails)
      return res
        .status(400)
        .json({ message: "No user found with the given user Id" });

    if (userDetails.isPrivate === false) {
      return res
        .status(200)
        .json({ message: "Details fetched!!", user: userDetails });
    }

    const isFollower = await Follow.findOne({
      isConfirmed: true,
      followerId: userId,
      followingId: user._id,
    });

    if (!isFollower)
      return res.status(200).json({ message: "You're not a follower!!!...follow for more details",user:{
        "name": userDetails.name,
        "_id":userDetails._id,
        "bio": userDetails.bio,
        "profilePic":userDetails.profilePic
      } });

    return res.status(201).json({ message: "Success", user: userDetails });
    
  } catch (error) {
    console.log("error getting profile details", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default { saveProfileDetails, changePassword, getProfileDetails };
