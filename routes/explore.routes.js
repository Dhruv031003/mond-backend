import express from "express"
import {getExplore} from "../controllers/explore.controller.js"

const exploreRouter=express.Router()

exploreRouter.get("/",getExplore)

export default exploreRouter