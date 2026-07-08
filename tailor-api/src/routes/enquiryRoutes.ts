import express from "express";
import { createEnquiry, getEnquiries, getEnquiryById, updateEnquiryStatus } from "../controllers/enquiryController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router();

router.get("/", authMiddleware, requireBoutique, getEnquiries);
router.get("/:id", authMiddleware, requireBoutique, getEnquiryById);
router.post("/", authMiddleware, requireBoutique, createEnquiry);
router.patch("/:id/status", authMiddleware, requireBoutique, updateEnquiryStatus);

export default router;
