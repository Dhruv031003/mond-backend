import express from "express"
import checkEmptyBody from "../middlewares/checkEmptyBody.middleware.js"
import {postAndReelDetailsValidator,returnErrors} from "../middlewares/validateData.middleware.js"
import {getPost,getAllPost,createPost} from "../controllers/post.controller.js"

const postRouter=express.Router()

postRouter.get("/",getAllPost)
postRouter.get("/:postId",getPost)
postRouter.post("/createPost",checkEmptyBody,postAndReelDetailsValidator,returnErrors,createPost)

export default postRouter