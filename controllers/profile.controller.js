import User from "../models/User.models.js";

const saveProfileDetails = async (req, res) => {
  try {
    const {
      name,
      bio,
      location,
      gender,
      postsCount,
      followersCount,
      isPrivate,
      profilePic,
    } = req.body;

    const user = req.user;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (gender) user.gender = gender;
    if (postsCount !== undefined) user.postsCount = postsCount;
    if (followersCount !== undefined) user.followersCount = followersCount;
    if (isPrivate !== undefined) user.isPrivate = isPrivate;
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save({ validateBeforeSave: false });

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

export default { saveProfileDetails, changePassword };
