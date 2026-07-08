import { Request, Response } from "express";
import Payment from "../models/Payment";
import Transaction from "../models/Transaction";

export const recordPayment = async (req: Request, res: Response) => {
  try {
    const { boutique, orderId, transactionId, customerId, amount, method, receiptUrl, note } = req.body;

    if (!boutique || !amount || !method) return res.status(400).json({ message: "Missing fields" });

    const payment = await Payment.create({
      boutique,
      order: orderId,
      transaction: transactionId,
      customer: customerId,
      amount,
      method,
      receiptUrl,
      note,
      createdBy: (req as any).user?._id,
    });

    if (transactionId) {
      const tx = await Transaction.findById(transactionId);
      if (tx) {
        tx.payments = tx.payments || [];
        tx.payments.push(payment._id);
        tx.advance = (tx.advance || 0) + amount;
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
    const { boutiqueId } = req.query;
    const filter: any = {};
    if (boutiqueId) filter.boutique = boutiqueId;
    const payments = await Payment.find(filter).sort({ date: -1 }).limit(500);
    res.json({ payments });
  } catch (error) {
    console.error("getPayments error:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
