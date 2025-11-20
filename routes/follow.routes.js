import express from "express"
import {acceptFollowRequest, getFollowersAndFollowingCount, getFollowersList, getFollowRequests, toggleFollow, getFollowingList} from "../controllers/follow.controller.js"

const followRouter= express.Router()

followRouter.post("/toggleFollow/:followingId",toggleFollow)

followRouter.get("/count",getFollowersAndFollowingCount)

followRouter.get("/requests",getFollowRequests)

followRouter.get("/accept/:followRequestId",acceptFollowRequest)

followRouter.get("/followersList",getFollowersList)

followRouter.get("/followingList",getFollowingList)

export default followRouter