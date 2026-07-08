import { Request, Response } from "express";
import Reminder from "../models/Reminder";
import notificationService from "../utils/notificationService";

export const createReminder = async (req: Request, res: Response) => {
  try {
    const { orderId, customerId, type, channel, sendAt, message } = req.body;
    const boutique = (req as any).boutiqueId;
    if (!boutique || !sendAt || !message) return res.status(400).json({ message: "Missing fields" });
    const reminder = await Reminder.create({ boutique, order: orderId, customer: customerId, type, channel, sendAt, message, createdBy: (req as any).user?.userId });
    res.json({ message: "Reminder created", reminder });
  } catch (error) {
    console.error("createReminder error:", error);
    res.status(500).json({ message: "Failed to create reminder" });
  }
};

export const processDueReminders = async (req: Request, res: Response) => {
  try {
    const due = await Reminder.find({ boutique: (req as any).boutiqueId, sent: false, sendAt: { $lte: new Date() } }).limit(200);
    const results: any[] = [];
    for (const r of due) {
      try {
        await notificationService.sendReminder(r);
        r.sent = true;
        r.sentAt = new Date();
        await r.save();
        results.push({ id: r._id, ok: true });
      } catch (err) {
        r.attempts = (r.attempts || 0) + 1;
        await r.save();
        results.push({ id: r._id, ok: false });
      }
    }
    res.json({ processed: results.length, results });
  } catch (error) {
    console.error("processDueReminders error:", error);
    res.status(500).json({ message: "Failed to process reminders" });
  }
};
