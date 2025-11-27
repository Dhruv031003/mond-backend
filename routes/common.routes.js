import express from "express"
import {toggleLike, deletePostReelOrStory, toggleComments} from "../controllers/common.controller.js"
import checkEmptyBody from "../middlewares/checkEmptyBody.middleware.js"

const commonRouter=express.Router()

commonRouter.post("/like",checkEmptyBody,toggleLike)
commonRouter.post("/delete",checkEmptyBody,deletePostReelOrStory)
commonRouter.post("/toggleComments",checkEmptyBody,toggleComments)

export default commonRouter