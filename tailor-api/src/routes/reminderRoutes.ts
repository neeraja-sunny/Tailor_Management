import express from "express";
import { createReminder, processDueReminders } from "../controllers/reminderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router();

router.post("/create", authMiddleware, requireBoutique, createReminder);
router.post("/process-due", authMiddleware, requireBoutique, processDueReminders);

export default router;
