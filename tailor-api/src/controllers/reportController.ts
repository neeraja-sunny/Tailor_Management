import { Request, Response } from "express";
import Transaction from "../models/Transaction";
import Payment from "../models/Payment";

function toCsv(rows: unknown[][]) {
  return rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
}

export const exportRevenueCsv = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query as any;
    const filter: any = { boutique: (req as any).boutiqueId };
    if (start || end) {
      filter.invoiceDate = {};
      if (start) filter.invoiceDate.$gte = new Date(start);
      if (end) filter.invoiceDate.$lte = new Date(end);
    }

    const txs = await Transaction.find(filter).populate("payments").limit(1000).lean();

    const rows: unknown[][] = [["Invoice", "InvoiceDate", "Amount", "Advance", "Balance"]];
    for (const t of txs) {
      rows.push([t.invoiceNumber, t.invoiceDate || "", t.amount || 0, t.advance || 0, t.balance || 0]);
    }

    const csv = toCsv(rows);
    res.setHeader("Content-Disposition", "attachment; filename=revenues.csv");
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
