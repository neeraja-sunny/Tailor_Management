import express from "express";
import { createOrder, getAllOrders, updateOrderStatus, getOrderById, updateOutfitStatus, receivePayment, addExtraCharge, getOrdersCountByDate, deleteOrder } from "../controllers/orderController";
import { requireBoutique } from "../middleware/boutiqueMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router()

router.post("/create", authMiddleware, requireBoutique, createOrder);

router.get("/all", authMiddleware, requireBoutique, getAllOrders);

router.patch("/:orderId/status", authMiddleware, requireBoutique, updateOrderStatus);

router.get("/count-by-date",authMiddleware, requireBoutique, getOrdersCountByDate );

router.get("/:id", authMiddleware, requireBoutique, getOrderById);

router.delete("/:id/delete", authMiddleware, requireBoutique, deleteOrder);

router.patch("/:id/receive-payment", authMiddleware, requireBoutique, receivePayment); 

router.patch("/:id/add-extra-charge", authMiddleware, requireBoutique, addExtraCharge);

router.patch("/item/:itemId/status", authMiddleware, requireBoutique, updateOutfitStatus);

export default router