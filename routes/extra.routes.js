import express from "express"
import checkEmptyBody from "../utils/checkEmptyBody.js"
import extraController from "../controllers/extra.controller.js"

const extraRouter= express.Router()

extraRouter.get("/waitlist/:email",extraController.joinWaitlist)
extraRouter.post("/contactUs",checkEmptyBody,extraController.contactUs)

export default extraRouter