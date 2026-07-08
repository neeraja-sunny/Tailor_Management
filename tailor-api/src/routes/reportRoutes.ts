import express from "express";
import { exportRevenueCsv, exportPaymentsCsv } from "../controllers/reportController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router();

router.get("/revenue/csv", authMiddleware, requireBoutique, exportRevenueCsv);
router.get("/payments/csv", authMiddleware, requireBoutique, exportPaymentsCsv);

export default router;
