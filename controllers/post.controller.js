import Follow from "../models/Follow.models.js";
import Post from "../models/Post.models.js";
import User from "../models/User.models.js";

const getAllPost = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = req.user;
    if (!userId || userId.toString()===user._id.toString()) {
      const allPosts = await Post.find({ userId: user._id, isDeleted: false });
      return res.status(200).json({ message: "success", allPosts });
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

    const allPosts = await Post.find({ userId, isArchived: false });
    return res.status(200).json({ message: "success", allPosts });
  } catch (error) {
    console.log("error while fetching all posts", error);
    return res.status(500).json({ message: "Couldn't fetch all posts" });
  }
};

const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    const post = await Post.findById(postId);

    if (!post || post.isDeleted)
      return res.status(404).json({ message: "This post doesn't exists" });

    if (post.userId.toString() === user._id.toString())
      return res.status(200).json({ message: "Post fetched!!", post });
    if (post.isArchived)
      return res.status(400).json({ message: "Post not found!!!" });

    const userDetails = await User.findById(post.userId).select("isPrivate");

    const isFollower = await Follow.findOne({
      isConfirmed: true,
      followerId: user._id,
      followingId: post.userId,
    });
    if (!isFollower && userDetails.isPrivate)
      return res.status(400).json({ message: "You're not a follower" });

    return res.status(200).json({ message: "Post found", post });
  } catch (error) {
    console.log("error while fetching single post", error);
    return res.status(500).json({ message: "Couldn't fetch post" });
  }
};

const createPost = async (req, res) => {
  try {
    const { description, location, isArchived, hashTags, fileType, objectURL } =
      req.body;
    const user = req.user;
    const post = await Post.create({
      userId: user._id,
      description,
      location,
      fileType,
      isArchived: isArchived ?? false,
      hashTags: hashTags ?? [],
      objectURL: objectURL ?? null,
    });
    return res.status(200).json({ message: "success", post });
  } catch (error) {
    console.log("Error while creating post", error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export { createPost, getPost, getAllPost };
