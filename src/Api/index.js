import express from "express";
import {
  registerController,
  singleRegisterController,
} from "../Controllers/register.controller.js";
import { loginController } from "../Controllers/login.controller.js";
import {
  forgetController,
  logOutController,
  uploadController,
} from "../Controllers/logout.controller.js";
import { jwtInstance } from "../Middleware/auth.middleware.js";
import { uploadImageInstance } from "../Middleware/malter.middleware.js";
const router = express.Router();

router.route("/register").post(registerController);
router.route("/login").post(loginController);
router
  .route("/uploadImage")
  .post(uploadImageInstance.single("image"), jwtInstance, uploadController);
router.route("/logout").all(jwtInstance, logOutController);

// get register data
router.route("/register").get(jwtInstance, singleRegisterController);
router.route("/forget").post(jwtInstance, forgetController);
// get register data

export { router };
