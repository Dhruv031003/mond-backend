import mongoose,{Schema} from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    objectId: {
      type: String,
      required: true,
      index: true,
    },
    objectType: {
      type: String,
      enum: ["post", "reel", "story"],
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

likeSchema.index({ userId: 1, objectId: 1, objectType: 1 }, { unique: true });

likeSchema.index({ objectId: 1, objectType: 1 });

const Like = mongoose.model("Like", likeSchema);

export default Like;
