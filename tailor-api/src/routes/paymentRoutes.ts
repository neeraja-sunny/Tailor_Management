import express from "express";
import { recordPayment, getPayments } from "../controllers/paymentController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/record", authMiddleware, recordPayment);
router.get("/", authMiddleware, getPayments);

export default router;
