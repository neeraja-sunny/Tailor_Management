import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import User from "../models/User";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId).select("-otp -otpExpires -password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
