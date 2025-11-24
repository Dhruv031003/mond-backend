import express from "express";
import {
  createStory,
  getActiveStories,
  toggleLikeStory,
  getArchivedStories,
  getStory
} from "../controllers/story.controller.js"
import checkEmptyBody from "../middlewares/checkEmptyBody.middleware.js";

const storyRouter = express.Router();

storyRouter.get("/", getActiveStories);
storyRouter.get("/single/:storyId",getStory)

storyRouter.post("/createStory",checkEmptyBody, createStory);

storyRouter.get("/:id/like", toggleLikeStory);

storyRouter.get("/archive", getArchivedStories);

export default storyRouter;