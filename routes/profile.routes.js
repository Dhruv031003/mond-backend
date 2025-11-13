import express from "express"
import profileController from "../controllers/profile.controller.js"
import {returnErrors,changePasswordValidator} from "../utils/validators.js"

const profileRouter=express.Router()

profileRouter.post("/profileDetails",profileController.saveProfileDetails)
profileRouter.post("/changePassword",changePasswordValidator,returnErrors,profileController.changePassword)

export default profileRouter