import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUser, updateProfile, getUserProfile, completeProfile } from "../controllers/userController";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router()

router.get("/get-user", authMiddleware, requireBoutique, getUser);

router.put("/profile", authMiddleware, updateProfile);

router.get("/get-profile", authMiddleware, requireBoutique, getUserProfile);

router.post("/complete-profile", authMiddleware, completeProfile);

export default router