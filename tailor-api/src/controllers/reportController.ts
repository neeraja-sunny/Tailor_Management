import { Request, Response } from "express";
import Order from "../models/Order";
import Payment from "../models/Payment";
import { getRevenueDateRange } from "../utils/revenueDateRange";

function toCsv(rows: unknown[][]) {
  return rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
}

export const exportRevenueCsv = async (req: Request, res: Response) => {
  try {
    const { period, selectedValue, start, end } = getRevenueDateRange(req.query.period, req.query);
    const filter: any = {
      boutique: (req as any).boutiqueId,
      status: { $ne: "cancelled" },
      isArchived: false,
      advanceGiven: { $gt: 0 },
      updatedAt: { $gte: start, $lt: end },
    };

    const orders = await Order.find(filter)
      .select("orderNumber updatedAt totalAmount advanceGiven balanceDue status")
      .sort({ updatedAt: 1 })
      .limit(5000)
      .lean();

    const rows: unknown[][] = [
      ["Statement", `${period}:${selectedValue}`],
      ["Start", start.toISOString()],
      ["End", end.toISOString()],
      [],
      ["Order", "RevenueDate", "TotalAmount", "RevenueReceived", "BalanceDue", "Status"],
    ];

    for (const order of orders) {
      rows.push([
        order.orderNumber,
        order.updatedAt || "",
        order.totalAmount || 0,
        order.advanceGiven || 0,
        order.balanceDue || 0,
        order.status || "",
      ]);
    }

    const csv = toCsv(rows);
    res.setHeader("Content-Disposition", `attachment; filename=revenue-${period}-${selectedValue}.csv`);
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (error) {
    console.error("exportRevenueCsv error:", error);
    res.status(500).json({ message: "Failed to export revenue" });
  }
};

export const exportPaymentsCsv = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query as any;
    const filter: any = { boutique: (req as any).boutiqueId };
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }

    const payments = await Payment.find(filter).limit(2000).lean();
    const rows: unknown[][] = [["Date", "Amount", "Method", "Order", "Transaction", "Note"]];
    for (const p of payments) {
      rows.push([p.date || "", p.amount || 0, p.method || "", p.order || "", p.transaction || "", p.note || ""]);
    }

    const csv = toCsv(rows);
    res.setHeader("Content-Disposition", "attachment; filename=payments.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (error) {
    console.error("exportPaymentsCsv error:", error);
    res.status(500).json({ message: "Failed to export payments" });
  }
};
