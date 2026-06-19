import Measurement from "../models/Measurement";
import { Request, Response } from "express";

export const createMeasurements = async (req: Request, res: Response) => {
  try {
    const boutiqueId = (req as any).boutiqueId;
    if (!boutiqueId) {
      return res.status(400).json({ message: "Active boutique not found" });
    }
    const measurement = await Measurement.create({ 
      ...req.body, 
      boutique: boutiqueId 
    });
    res.status(201).json(measurement);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
