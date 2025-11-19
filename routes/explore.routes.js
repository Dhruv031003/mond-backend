import express from "express"
import {getExplore} from "../controllers/explore.controller.js"
import checkEmptyBody from "../middlewares/checkEmptyBody.middleware.js"

const exploreRouter=express.Router()

exploreRouter.get("/",checkEmptyBody,getExplore)

export default exploreRouter