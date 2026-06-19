import express from "express";
import { addStaff, getStaff, deleteStaff } from "../controllers/staffController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router();

router.post("/add", authMiddleware, addStaff);
router.get("/get", authMiddleware, getStaff);
router.delete("/:staffId", authMiddleware, deleteStaff);

export default router;