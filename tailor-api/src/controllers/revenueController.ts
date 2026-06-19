import Order from "../models/Order";
import { Request, Response } from "express";

export const getRevenueSummary = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const { year, month } = req.query;

    const match: any = {
      boutique: boutiqueId,
      status: "delivered",
      balanceDue: 0,
    };

    if (year && month) {
      const monthIndex = Number(month) - 1;
      const start = new Date(Number(year), monthIndex, 1);
      const end = new Date(Number(year), monthIndex + 1, 1);
      match.updatedAt = { $gte: start, $lt: end };
    }

    const result = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      totalRevenue: result[0]?.totalRevenue || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch revenue data" });
  }
};


export const getDailyRevenue = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const { year, month } = req.query;

    const match: any = {
      boutique: boutiqueId,
      status: "delivered",
      balanceDue: 0,
    };

    if (year && month) {
      const monthIndex = Number(month) - 1;
      const start = new Date(Number(year), monthIndex, 1);
      const end = new Date(Number(year), monthIndex + 1, 1);
      match.updatedAt = { $gte: start, $lt: end };
    }

    const revenue = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$updatedAt",
              },
            },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch daily revenue" });
  }
};


export const getRevenueBreakdownByDate = async (
  req: Request,
  res: Response
) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const { date } = req.params; // YYYY-MM-DD

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const orders = await Order.find({
      boutique: boutiqueId,
      status: "delivered",
      balanceDue: 0,
      updatedAt: { $gte: start, $lt: end },
    }).select("orderNumber totalAmount items createdAt");

    console.log(orders, "orders from revenue breakdown - delivered one");

    res.json(
      orders.map((o) => ({
        orderNumber: o.orderNumber,
        totalAmount: o.totalAmount,
        outfits: o.items.length,
        date: o.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch breakdown" });
  }
};

