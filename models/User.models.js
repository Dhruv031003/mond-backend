import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    gender: {
      type: String,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    isPrivate:{
      type: Boolean
    },
    phoneNo: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("Error hashing password", error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (inputPassword) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, this.password);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Internal server error");
  }
};

const User = mongoose.model("User", userSchema);
export default User;
