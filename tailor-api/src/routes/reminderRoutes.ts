import express from "express";
import { createReminder, processDueReminders } from "../controllers/reminderController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create", authMiddleware, createReminder);
router.post("/process-due", authMiddleware, processDueReminders);

export default router;
