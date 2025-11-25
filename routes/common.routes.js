import express from "express"
import {toggleLike, deletePostReelOrStory} from "../controllers/common.controller.js"

const commonRouter=express.Router()

commonRouter.post("/like",toggleLike)
commonRouter.post("/delete",deletePostReelOrStory)

export default commonRouter