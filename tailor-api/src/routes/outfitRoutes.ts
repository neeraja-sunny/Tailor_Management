import express from "express"
import { createOutfit, getOutfit } from "../controllers/outfitController"
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router()

router.post("/create",authMiddleware, requireBoutique, createOutfit);

router.get("/get", authMiddleware, requireBoutique, getOutfit);

export default router