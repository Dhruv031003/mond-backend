import express from "express"
import profileController from "../controllers/profile.controller.js"

const profileRouter=express.Router()

profileRouter.post("/profileDetails",profileController.saveProfileDetails)

export default profileRouter