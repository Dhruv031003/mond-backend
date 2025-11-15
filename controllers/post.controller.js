import Post from "../models/Post.models.js";

const getAllPost = async (req, res) => {
  try {
    const user = req.user;
    const allPosts = await Post.find({ userId: user._id });
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

    if (!post)
      return res.status(404).json({ message: "This post doesn't exists" });
    return res.status(200).json({ message: "success", post });
  } catch (error) {
    console.log("error while fetching single post", error);
    return res.status(500).json({ message: "Couldn't fetch post" });
  }
};

const createPost = async (req, res) => {
  try {
    const { description, location, isArchived, hashTags, imageURL } = req.body;
    const user = req.user;
    const post = await Post.create({
      userId: user._id,
      description,
      location,
      isArchived: isArchived ?? false,
      hashTags: hashTags ?? [],
      imageURL: imageURL ?? null,
    });
    return res.status(200).json({ message: "success", post });
    
  } catch (error) {
    console.log("Error while creating post", error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export { createPost, getPost, getAllPost };
