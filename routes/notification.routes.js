import express from "express"
import {getNotifications,markNotificationAsRead,markAllAsRead} from "../controllers/notification.controller.js"

const notificationRouter=express.Router()

notificationRouter.patch("/markAsRead/:notificationId",markNotificationAsRead)
notificationRouter.patch("/readAll",markAllAsRead)

notificationRouter.get("/",getNotifications)

export default notificationRouter