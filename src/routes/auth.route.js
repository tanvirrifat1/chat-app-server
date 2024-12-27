import express from "express";
import { authController } from "../controller/auth.controller.js";
import { protectRoute } from "../middlware/auth.middleware.js";

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.patch("/update-profile", protectRoute, authController.updateProfile);

router.get("/check", protectRoute, authController.checkAuth);

export default router;
