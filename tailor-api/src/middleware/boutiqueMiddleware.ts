import { Request, Response, NextFunction } from "express";
import Boutique from "../models/Boutique";

export const requireBoutique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!(req as any).user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // OWNER FLOW
    if ((req as any).user.role === "owner") {
      if (!(req as any).user.activeBoutique) {
        return res.status(400).json({
          message: "No active boutique selected",
        });
      }

      const boutique = await Boutique.findOne({
        _id: (req as any).user.activeBoutique,
        owner: (req as any).user.userId,
      });

      if (!boutique) {
        return res.status(403).json({
          message: "Boutique access denied",
        });
      }

      (req as any).boutiqueId = boutique._id;
      return next();
    }

    // STAFF FLOW
    if ((req as any).user.role === "staff") {
      if (!(req as any).user.boutique) {
        return res.status(400).json({
          message: "Staff not assigned to a boutique",
        });
      }

      (req as any).boutiqueId = (req as any).user.boutique;
      return next();
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch (error) {
    console.error("❌ requireBoutique error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
