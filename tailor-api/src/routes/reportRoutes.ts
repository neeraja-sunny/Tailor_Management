import express from "express";
import { exportRevenueCsv, exportPaymentsCsv } from "../controllers/reportController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get("/revenue/csv", authMiddleware, exportRevenueCsv);
router.get("/payments/csv", authMiddleware, exportPaymentsCsv);

export default router;
