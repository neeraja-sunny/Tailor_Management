import { Request, Response } from "express";
import Customer from "../models/Customer";
import Order from "../models/Order";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    if (!boutiqueId) {
      return res.status(400).json({ message: "Active boutique not found" });
    }
    const customer = new Customer({ 
      ...req.body, 
      boutique: boutiqueId 
    });

    await customer.save();
    return res.status(201).json(customer);
  } catch (err) {
    return res.status(500).json({ error: err.message, message: "Failed to create customer" });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    console.log("Boutique ID in getCustomers:", boutiqueId);
    if (!boutiqueId) {
      return res.status(400).json({ message: "Active boutique not found" });
    }
    const customers = await Customer.find({ 
      boutique: boutiqueId 
    }).sort({ createdAt: -1 });
    console.log("Fetched customers:", customers);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const boutiqueId = (req as any).boutiqueId;
    if (!boutiqueId) {
      return res.status(400).json({ message: "Active boutique not found" });
    }

    const customer = await Customer.findOne({ _id: id, boutique: boutiqueId });

    console.log("Fetched customer:", customer);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer details" });
  }
};

export const getOrdersByCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id, 'id')

    const boutiqueId = (req as any).boutiqueId;
    if (!boutiqueId) {
      return res.status(400).json({ message: "Active boutique not found" });
    }

    const orders = await Order.find({ customer: id, boutique: boutiqueId })
      .sort({ createdAt: -1 });

    console.log("Orders:", orders);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
};



