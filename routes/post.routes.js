import express from "express"
import checkEmptyBody from "../utils/checkEmptyBody.js"
import {postDetailsValidator,returnErrors} from "../utils/validators.js"
import {getPost,getAllPost,createPost} from "../controllers/post.controller.js"

const postRouter=express.Router()

postRouter.get("/",getAllPost)
postRouter.get("/:postId",getPost)
postRouter.post("/createPost",checkEmptyBody,postDetailsValidator,returnErrors,createPost)

export default postRouter