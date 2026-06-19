import express from "express";
import { getRevenueSummary, getDailyRevenue, getRevenueBreakdownByDate } from "../controllers/revenueController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router();

router.get("/summary", authMiddleware, requireBoutique, getRevenueSummary);

router.get("/daily", authMiddleware, requireBoutique, getDailyRevenue);

router.get("/breakdown/:date", authMiddleware, requireBoutique, getRevenueBreakdownByDate);

export default router;