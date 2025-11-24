import express from "express";
import authController from "../controllers/auth.controller.js";
import {
  emailLoginValidator,
  emailRegisterValidator,
  phoneLoginValidator,
  phoneRegisterValidator,
  returnErrors
} from "../middlewares/validateData.middleware.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

import {saveDeviceToken} from "../middlewares/saveDeviceToken.js";


const authRouter = express.Router();

authRouter.post("/saveDeviceToken",verifyUser,saveDeviceToken)

authRouter.get("/logout", verifyUser, authController.logoutHandler);

authRouter.post("/google/callback", authController.oAuthHandler);

authRouter.post(
  "/login/email",
  emailLoginValidator,
  returnErrors,
  authController.emailLoginHandler
);
authRouter.post(
  "/login/phoneNo",
  phoneLoginValidator,
  returnErrors,
  authController.phoneLoginHandler
);

authRouter.post(
  "/register/email",
  emailRegisterValidator,
  returnErrors,
  authController.emailRegisterHandler
);
authRouter.post(
  "/register/phoneNo",
  phoneRegisterValidator,
  returnErrors,
  authController.phoneRegisterHandler
);
authRouter.post(
  "/refresh/accessToken",
  authController.refreshAccessTokenHandler
);

export default authRouter;
