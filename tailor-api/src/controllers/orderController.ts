import { Request, Response } from "express";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Measurement from "../models/Measurement";
import { generateOrderNumber } from "../utils/generateOrderNumber";
import Boutique from "../models/Boutique";
import { sendEmail } from "../utils/emailService";
import Payment from "../models/Payment";
import Transaction from "../models/Transaction";

export const createOrder = async (req: Request, res: Response) => {
  try {

    const {
      customerId,
      outfits,   
      advanceGiven = 0,
      notes,
       
    } = req.body;

    const boutiqueId = (req as any).boutiqueId; 

    if (!customerId)
      return res.status(400).json({ message: "customerId is required" });

    if (!outfits || outfits.length === 0)
      return res.status(400).json({ message: "At least one outfit is required" });

    const createdItemIds: any[] = [];
    let totalAmount = 0;


const LIMIT = 15;
const forceDeliveryDate = req.body.forceDeliveryDate === true;

const deliveryDates: string[] = outfits
  .map((o: any) => o.deliveryDate)
  .filter(Boolean)
  .map((d: string | Date) =>
    typeof d === "string" ? d : d.toISOString()
  );

const uniqueDeliveryDates = [...new Set(deliveryDates)];


for (const date of uniqueDeliveryDates) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const ordersCount = await OrderItem.countDocuments({
    boutique: boutiqueId,
    deliveryDate: { $gte: start, $lte: end },
  });

  if (ordersCount >= LIMIT && !forceDeliveryDate) {
    return res.status(409).json({
      message: "Delivery date limit exceeded",
      deliveryDate: date,
      totalOrders: ordersCount,
      limit: LIMIT,
    });
  }
}



    for (const item of outfits) {

      // Create OrderItem
      const orderItem = await OrderItem.create({
        boutique: boutiqueId,
        name: item.name,
        category: item.category,
        quantity: item.quantity || 1,
        type: item.type || "stitching",
        inspirationLink: item.inspirationLink || "",
        audioUrl: item.audioUrl || "",
        specialInstructions: item.specialInstructions || "",
        referenceImages: item.referenceImages || [],
        measurements: item.measurements || null,
        stitchOptions: item.stitchOptions || {},
        stitchingPrice: item.stitchingPrice || 0,
        additionalPrice: item.additionalPrice || 0,
        trialDate: item.trialDate ? new Date(item.trialDate) : null,
        deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : null,
      });

      createdItemIds.push(orderItem._id);

      // Calculate total pricing
      totalAmount +=
        (orderItem.stitchingPrice || 0) * (orderItem.quantity || 1) +
        (orderItem.additionalPrice || 0);
    }
    const orderNumber = await generateOrderNumber();

    const balanceDue = totalAmount - (advanceGiven || 0);

    const order = await Order.create({
      orderNumber,
      boutique: boutiqueId,
      customer: customerId,
      items: createdItemIds,
      totalAmount,
      advanceGiven,
      balanceDue,
      notes,
      status: req.body.status || "active",
    });

    const transaction = await Transaction.create({ boutique: boutiqueId, order: order._id, invoiceNumber: order.orderNumber, amount: totalAmount, advance: advanceGiven, balance: balanceDue, invoiceDate: new Date(), payments: [] });
    if (Number(advanceGiven) > 0) {
      const payment = await Payment.create({ boutique: boutiqueId, order: order._id, transaction: transaction._id, customer: customerId, amount: Number(advanceGiven), date: new Date(), method: req.body.paymentMethod || "cash", note: "Advance payment", createdBy: (req as any).user?.userId });
      transaction.payments = [payment._id];
      await transaction.save();
    }
    

    return res.status(201).json({
      message: "Order created",
      orderId: order._id,
      orderNumber: order.orderNumber,
    });

  } catch (err: any) {
    console.error("❌ ORDER CREATION ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


// Get All Orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;

    if (!boutiqueId) {
      return res.status(400).json({ message: "No boutique found" });
    }
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 50, 200);

    const filter = { boutique: boutiqueId, isArchived: false };
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .select("orderNumber customer items totalAmount advanceGiven balanceDue status createdAt deliveredAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("customer", "name")
      .populate({
        path: "items",
        model: "OrderItem",
        select: "name deliveryDate trialDate status",
      })
      .lean();

    return res.json({ orders, meta: { page, limit, total } });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


// update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const { status } = req.body;
    const { orderId } = req.params;

    const allowed = [
      "draft",
      "active",
      "past_due",
      "upcoming",
      "pending_payment",
      "delivered",
      "cancelled"
    ];

    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const statusUpdate = status === "delivered"
      ? { $set: { status, deliveredAt: new Date() } }
      : { $set: { status }, $unset: { deliveredAt: "" } };

    const order = await Order.findOneAndUpdate(
      { boutique: boutiqueId, _id: orderId },
      statusUpdate,
      { new: true }
    );

    return res.json({ message: "Status updated", order });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


// Get Order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const order = await Order.findOne({ boutique: boutiqueId, _id: req.params.id })
      .populate("customer")
      .populate({
    path: "items",
    populate: {
      path: "measurements",
      model: "Measurement",
    },
  });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({ order });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const receivePayment = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const { id } = req.params;
    const { amount, method = "cash", note = "" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await Order.findOne({ boutique: boutiqueId, _id: id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const currentAdvance = order.advanceGiven || 0;
    const newAdvance = currentAdvance + amount;

    order.advanceGiven = newAdvance;

    order.balanceDue = Math.max(
      order.totalAmount - newAdvance,
      0
    );

    await order.save();

    const transaction = await Transaction.findOneAndUpdate(
      { boutique: boutiqueId, order: order._id },
      { $setOnInsert: { boutique: boutiqueId, order: order._id, invoiceNumber: order.orderNumber, invoiceDate: order.createdAt }, $set: { amount: order.totalAmount, advance: order.advanceGiven, balance: order.balanceDue } },
      { new: true, upsert: true }
    );
    const payment = await Payment.create({ boutique: boutiqueId, order: order._id, transaction: transaction._id, customer: order.customer, amount: Number(amount), date: new Date(), method, note, createdBy: (req as any).user?.userId });
    transaction.payments = [...(transaction.payments || []), payment._id];
    await transaction.save();

    return res.json({
      message: "Payment received successfully",
      order,
      payment,
    });
  } catch (err) {
    console.error("RECEIVE PAYMENT ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const sendInvoiceEmail = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const invoice = (req as any).file;
    if (!invoice?.buffer) {
      return res.status(400).json({ message: "Invoice PDF is required" });
    }

    const order = await Order.findOne({ boutique: boutiqueId, _id: req.params.id })
      .populate("customer", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const customer = order.customer as any;
    if (!customer?.email) {
      return res.status(400).json({ message: "This customer does not have an email address" });
    }

    const total = Number(order.totalAmount || 0).toLocaleString("en-IN");
    const paid = Number(order.advanceGiven || 0).toLocaleString("en-IN");
    const balance = Number(order.balanceDue || 0).toLocaleString("en-IN");
    await sendEmail(
      customer.email,
      `Invoice ${order.orderNumber} from TailorPro`,
      {
        text: `Hello ${customer.name || "Customer"},\n\nYour invoice ${order.orderNumber} is attached.\nTotal: INR ${total}\nPaid: INR ${paid}\nBalance due: INR ${balance}\n\nThank you.`,
        attachments: [
          {
            filename: `Invoice-${order.orderNumber}.pdf`,
            content: invoice.buffer,
            contentType: "application/pdf",
          },
        ],
      }
    );

    return res.json({ message: `Invoice sent to ${customer.email}` });
  } catch (error) {
    console.error("SEND INVOICE ERROR:", error);
    return res.status(500).json({ message: "Unable to email invoice" });
  }
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const recalculateDiscountedTotal = (order: any, grossAmount: number) => {
  const safeGross = Math.max(roundMoney(grossAmount), 0);
  const value = Math.max(Number(order.discountValue) || 0, 0);
  const discount = order.discountType === "percentage"
    ? safeGross * Math.min(value, 100) / 100
    : Math.min(value, safeGross);

  order.discountAmount = roundMoney(discount);
  order.totalAmount = roundMoney(safeGross - order.discountAmount);
  order.balanceDue = roundMoney(Math.max(order.totalAmount - (order.advanceGiven || 0), 0));
};

export const applyOrderDiscount = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const type = req.body.type?.toString();
    const value = Number(req.body.value);

    if (!["fixed", "percentage"].includes(type) || !Number.isFinite(value) || value < 0) {
      return res.status(400).json({ message: "Enter a valid offer" });
    }
    if (type === "percentage" && value > 100) {
      return res.status(400).json({ message: "Percentage cannot exceed 100" });
    }

    const order = await Order.findOne({ boutique: boutiqueId, _id: req.params.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const grossAmount = (order.totalAmount || 0) + (order.discountAmount || 0);
    order.discountType = type as "fixed" | "percentage";
    order.discountValue = value;
    recalculateDiscountedTotal(order, grossAmount);
    await order.save();

    return res.json({ message: value === 0 ? "Offer removed" : "Offer applied", order });
  } catch (err) {
    console.error("APPLY DISCOUNT ERROR:", err);
    return res.status(500).json({ message: "Unable to apply offer" });
  }
};



export const addExtraCharge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, amount } = req.body;
    const boutiqueId = (req as any).boutiqueId;

    if (!reason || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid charge data" });
    }

    const order = await Order.findOne({ boutique: boutiqueId, _id: id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Add charge
    order.additionalCharges = order.additionalCharges || [];
    order.additionalCharges.push({
      reason,
      amount,
      createdAt: new Date(),
    });

    // Recalculate so percentage offers also apply to charges added later.
    const grossAmount = (order.totalAmount || 0) + (order.discountAmount || 0) + amount;
    recalculateDiscountedTotal(order, grossAmount);

    await order.save();

    res.json({
      message: "Additional charge added",
      order,
    });
  } catch (err) {
    console.error("ADD CHARGE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// update outfit status
export const updateOutfitStatus = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;
    const boutiqueId = (req as any).boutiqueId;

    // Update OrderItem status
    const item = await OrderItem.findOne({ _id: itemId, boutique: boutiqueId });
    if (!item) return res.status(404).json({ message: "Order item not found" });

    item.status = status;
    await item.save();

    // Find the parent order (item._id is inside order.items array)
    const order = await Order.findOne({ items: itemId, boutique: boutiqueId }).populate("items");
    console.log(order,"📦parent order")
    if (!order) return res.status(404).json({ message: "Parent order not found" });

    // ✔ Check if all items have status = completed
    const allCompleted = order.items.every((i: any) => i.status === "completed");
    console.log(allCompleted,"✅ all outfits completed?")

    if (allCompleted) {
      order.status = "delivered";
      order.deliveredAt = order.deliveredAt || new Date();
      await order.save();
    }

    return res.json({
      success: true,
      message: "Outfit status updated",
      item,
      orderUpdated: allCompleted ? "Order marked as delivered" : "No change",
    });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateOutfitDetails = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    const { itemId } = req.params;
    const item = await OrderItem.findOne({ _id: itemId, boutique: boutiqueId });
    if (!item) return res.status(404).json({ message: "Order item not found" });

    const allowedFields = [
      "name", "category", "type", "quantity", "inspirationLink",
      "specialInstructions", "stitchingPrice", "additionalPrice",
      "trialDate", "deliveryDate",
    ] as const;

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        (item as any)[field] = req.body[field] === "" && ["trialDate", "deliveryDate"].includes(field)
          ? null
          : req.body[field];
      }
    }

    item.quantity = Math.max(Number(item.quantity) || 1, 1);
    item.stitchingPrice = Math.max(Number(item.stitchingPrice) || 0, 0);
    item.additionalPrice = Math.max(Number(item.additionalPrice) || 0, 0);
    await item.save();

    const order = await Order.findOne({ boutique: boutiqueId, items: itemId }).populate("items");
    if (!order) return res.status(404).json({ message: "Parent order not found" });

    const itemsTotal = (order.items as any[]).reduce(
      (sum, current) => sum + ((current.stitchingPrice || 0) + (current.additionalPrice || 0)) * (current.quantity || 1),
      0
    );
    const chargesTotal = (order.additionalCharges || []).reduce(
      (sum: number, charge: any) => sum + (Number(charge.amount) || 0),
      0
    );
    recalculateDiscountedTotal(order, itemsTotal + chargesTotal);
    await order.save();

    return res.json({ message: "Outfit details updated", item, order });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getOrdersCountByDate = async (req: Request, res: Response) => {
  try {

    console.log("Fetching order count by date...", req.query);

    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "Valid date is required" });
    }

    const parsedDate = new Date(`${date}T00:00:00`);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const start = new Date(parsedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(parsedDate);
    end.setHours(23, 59, 59, 999);

    const boutiqueId = (req as any).boutiqueId;

    const boutique = await Boutique.findById(boutiqueId).select(
      "dailyOrderLimit"
    );

    if (!boutique) {
      return res.status(400).json({ message: "Boutique not found" });
    }

    const count = await OrderItem.countDocuments({
      boutique: boutiqueId,
      deliveryDate: {    
        $gte: start,
        $lte: end,
      },
    });

    const LIMIT = boutique.dailyOrderLimit;

    return res.json({
      date,
      totalOrders: count,
      limit: LIMIT,
      exceeded: count >= LIMIT,
    });

  } catch (error: any) {
    console.error("❌ count-by-date ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// delete order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const boutiqueId = (req as any).boutiqueId;
    const order = await Order.findOne({ _id: id, boutique: boutiqueId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Soft delete
    order.isArchived = true;
    await order.save();
    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};






