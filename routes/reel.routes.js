import express from "express"
import checkEmptyBody from "../utils/checkEmptyBody.js"
import {postAndReelDetailsValidator,returnErrors} from "../utils/validators.js"
import {getReel,getAllReels,createReel} from "../controllers/reel.controller.js"

const reelRouter=express.Router()

reelRouter.get("/",getAllReels)
reelRouter.get("/:reelId",getReel)
reelRouter.post("/createReel",checkEmptyBody,postAndReelDetailsValidator,returnErrors,createReel)

export default reelRouter