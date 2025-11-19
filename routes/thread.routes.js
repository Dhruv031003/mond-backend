import express from "express"
import {getThread, getAllThreads, createThread,getReplies} from "../controllers/thread.controller.js"

const threadRouter=express.Router()

threadRouter.get("/",getAllThreads)
threadRouter.get("/:threadId",getThread)
threadRouter.get("/getReplies/:threadId",getReplies)
threadRouter.post("/createThread",createThread)

export default threadRouter