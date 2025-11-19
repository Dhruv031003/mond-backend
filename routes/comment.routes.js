import express from "express";
import {
  createComment,
  getAllComments,
  getReplies,
  toggleLikeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/createComment", createComment);
router.get("/", getAllComments);
router.get("/replies", getReplies);
router.post("/like/:commentId", toggleLikeComment);

export default router;
