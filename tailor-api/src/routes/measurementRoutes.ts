import { createMeasurements } from "../controllers/measurementController";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router()

router.post("/create", authMiddleware, requireBoutique, createMeasurements);

export default router