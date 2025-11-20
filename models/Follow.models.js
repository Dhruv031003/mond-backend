import mongoose, { Schema } from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isConfirmed:{
        type: Boolean,
        default: false
    }
  },
  { timestamps: true, versionKey: false }
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
