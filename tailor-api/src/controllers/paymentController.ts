import { Request, Response } from "express";
import Payment from "../models/Payment";
import Transaction from "../models/Transaction";

export const recordPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, transactionId, customerId, amount, method, receiptUrl, note } = req.body;
    const boutique = (req as any).boutiqueId;

    if (!boutique || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !method) return res.status(400).json({ message: "Valid amount and payment method are required" });

    const payment = await Payment.create({
      boutique,
      order: orderId,
      transaction: transactionId,
      customer: customerId,
      amount: Number(amount),
      method,
      receiptUrl,
      note,
      createdBy: (req as any).user?.userId,
    });

    if (transactionId) {
      const tx = await Transaction.findOne({ _id: transactionId, boutique });
      if (tx) {
        tx.payments = tx.payments || [];
        tx.payments.push(payment._id);
        tx.advance = (tx.advance || 0) + Number(amount);
        tx.balance = (tx.amount || 0) - (tx.advance || 0);
        await tx.save();
      }
    }

    res.json({ message: "Payment recorded", payment });
  } catch (error) {
    console.error("recordPayment error:", error);
    res.status(500).json({ message: "Failed to record payment" });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const filter: any = { boutique: (req as any).boutiqueId };
    const payments = await Payment.find(filter).sort({ date: -1 }).limit(500);
    res.json({ payments });
  } catch (error) {
    console.error("getPayments error:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
