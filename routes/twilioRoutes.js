import express from "express";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createSmsController,
  getUserListController,
  validatePhoneController,
} from "../controller/twilioController.js";

const router = express.Router();

//routes

router.post("/sms", requireSignIn, isAdmin, createSmsController);
router.post("/verifyPhone", requireSignIn, isAdmin, validatePhoneController);
router.get("/userList", requireSignIn, isAdmin, getUserListController);

export default router;
