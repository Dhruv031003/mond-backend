import express from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  createStory,
  getUserStories,
  toggleLikeStory,
  getArchivedStories,
  getStory,
  getSingleArchivedStory
} from "../controllers/story.controller.js";
import checkEmptyBody from "../middlewares/checkEmptyBody.middleware.js";

const storyRouter = express.Router();

storyRouter.get("/", getUserStories);
storyRouter.get("/single/:storyId",getStory)

storyRouter.post("/createStory",checkEmptyBody, createStory);

storyRouter.get("/:id/like", toggleLikeStory);

storyRouter.get("/archive", getArchivedStories);
storyRouter.get("/archive/single/:id", getSingleArchivedStory);

export default storyRouter;
