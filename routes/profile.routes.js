import express from "express"
import profileController from "../controllers/profile.controller.js"
import {returnErrors,changePasswordValidator,setProfileDetailsValidator} from "../utils/validators.js"
import checkEmptyBody from "../utils/checkEmptyBody.js"

const profileRouter=express.Router()

profileRouter.get("/",profileController.getProfileDetails)
profileRouter.post("/profileDetails",checkEmptyBody,setProfileDetailsValidator,returnErrors,profileController.saveProfileDetails)
profileRouter.post("/changePassword",changePasswordValidator,returnErrors,profileController.changePassword)

export default profileRouter