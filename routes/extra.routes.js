import express from "express"
import checkEmptyBody from "../middlewares/checkEmptyBody.middleware.js"
import extraController from "../controllers/extra.controller.js"

const extraRouter= express.Router()

extraRouter.get("/waitlist/:email",extraController.joinWaitlist)
extraRouter.post("/contactUs",checkEmptyBody,extraController.contactUs)

export default extraRouter