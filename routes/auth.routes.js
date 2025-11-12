import express from "express";
import userController from "../controllers/user.controller.js";
import {
  emailLoginValidator,
  emailRegisterValidator,
  phoneLoginValidator,
  phoneRegisterValidator,
} from "../utils/validators.js";
import verifyAuth from "../controllers/auth.controller.js";
const userRouter = express.Router();

userRouter.get("/logout", verifyAuth, userController.logoutHandler);

userRouter.post("/google/callback", userController.oAuthHandler);

userRouter.post(
  "/login/email",
  emailLoginValidator,
  userController.emailLoginHandler
);
userRouter.post(
  "/login/phoneNo",
  phoneLoginValidator,
  userController.phoneLoginHandler
);

userRouter.post(
  "/register/email",
  emailRegisterValidator,
  userController.emailRegisterHandler
);
userRouter.post(
  "/register/phoneNo",
  phoneRegisterValidator,
  userController.phoneRegisterHandler
);
userRouter.post(
  "/refresh/accessToken",
  userController.refreshAccessTokenHandler
);

export default userRouter;
