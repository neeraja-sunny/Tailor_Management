import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createCustomer, getCustomerById, getCustomers, getOrdersByCustomer } from "../controllers/customerController";
import { requireBoutique } from "../middleware/boutiqueMiddleware";

const router = express.Router()

router.post("/create", authMiddleware, requireBoutique, createCustomer);

router.get("/", authMiddleware, requireBoutique, getCustomers);

router.get("/:id", authMiddleware, requireBoutique, getCustomerById);

router.get("/:id/orders", authMiddleware, requireBoutique, getOrdersByCustomer);

export default router