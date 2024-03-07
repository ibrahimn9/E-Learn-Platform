import express from "express";
import { signInController } from "../controllers/authController.js";
const router = express.Router();

router.post("/signIn", signInController);

export default router;
