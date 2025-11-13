import express from "express";
import userController from "../controllers/user.controller.js";
import {
  emailLoginValidator,
  emailRegisterValidator,
  phoneLoginValidator,
  phoneRegisterValidator,
  returnErrors
} from "../utils/validators.js";
import verifyAuth from "../controllers/auth.controller.js";
const userRouter = express.Router();

userRouter.get("/logout", verifyAuth, userController.logoutHandler);

userRouter.post("/google/callback", userController.oAuthHandler);

userRouter.post(
  "/login/email",
  emailLoginValidator,
  returnErrors,
  userController.emailLoginHandler
);
userRouter.post(
  "/login/phoneNo",
  phoneLoginValidator,
  returnErrors,
  userController.phoneLoginHandler
);

userRouter.post(
  "/register/email",
  emailRegisterValidator,
  returnErrors,
  userController.emailRegisterHandler
);
userRouter.post(
  "/register/phoneNo",
  phoneRegisterValidator,
  returnErrors,
  userController.phoneRegisterHandler
);
userRouter.post(
  "/refresh/accessToken",
  userController.refreshAccessTokenHandler
);

export default userRouter;
