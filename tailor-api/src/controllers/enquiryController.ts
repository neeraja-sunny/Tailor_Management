import { Request, Response } from "express";
import Enquiry from "../models/Enquiry";

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const enquiries = await Enquiry.find({ boutique: (req as any).boutiqueId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json({ enquiries });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load enquiries" });
  }
};

export const getEnquiryById = async (req: Request, res: Response) => {
  try {
    const enquiry = await Enquiry.findOne({
      _id: req.params.id,
      boutique: (req as any).boutiqueId,
    }).lean();
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    return res.json({ enquiry });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load enquiry" });
  }
};

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const name = req.body.name?.toString().trim();
    if (!name) return res.status(400).json({ message: "Customer name is required" });

    const enquiry = await Enquiry.create({
      boutique: (req as any).boutiqueId,
      name,
      phone: req.body.phone?.toString().trim() || "",
      note: req.body.note?.toString().trim() || "",
    });
    return res.status(201).json({ enquiry });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create enquiry" });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const allowed = ["new", "contacted", "converted"];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid enquiry status" });
    }
    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: req.params.id, boutique: (req as any).boutiqueId },
      { status: req.body.status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    return res.json({ enquiry });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update enquiry" });
  }
};
