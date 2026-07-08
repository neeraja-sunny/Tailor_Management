import express from "express";
import multer from "multer";
import { createOrder, getAllOrders, updateOrderStatus, getOrderById, updateOutfitStatus, updateOutfitDetails, receivePayment, addExtraCharge, applyOrderDiscount, getOrdersCountByDate, deleteOrder, sendInvoiceEmail } from "../controllers/orderController";
import { requireBoutique } from "../middleware/boutiqueMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router()
const invoiceUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req: any, file: any, callback: any) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF invoices are allowed"));
    }
    callback(null, true);
  },
});

router.post("/create", authMiddleware, requireBoutique, createOrder);

router.get("/all", authMiddleware, requireBoutique, getAllOrders);

router.patch("/:orderId/status", authMiddleware, requireBoutique, updateOrderStatus);

router.get("/count-by-date",authMiddleware, requireBoutique, getOrdersCountByDate );

router.get("/:id", authMiddleware, requireBoutique, getOrderById);

router.delete("/:id/delete", authMiddleware, requireBoutique, deleteOrder);

router.patch("/:id/receive-payment", authMiddleware, requireBoutique, receivePayment); 

router.patch("/:id/add-extra-charge", authMiddleware, requireBoutique, addExtraCharge);

router.patch("/:id/discount", authMiddleware, requireBoutique, applyOrderDiscount);

router.post("/:id/send-invoice", authMiddleware, requireBoutique, invoiceUpload.single("invoice"), sendInvoiceEmail);

router.patch("/item/:itemId/status", authMiddleware, requireBoutique, updateOutfitStatus);
router.patch("/item/:itemId", authMiddleware, requireBoutique, updateOutfitDetails);

export default router
