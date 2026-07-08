import express from "express";
import { recordPayment, getPayments } from "../controllers/paymentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router();

router.post("/record", authMiddleware, requireBoutique, recordPayment);
router.get("/", authMiddleware, requireBoutique, getPayments);

export default router;
