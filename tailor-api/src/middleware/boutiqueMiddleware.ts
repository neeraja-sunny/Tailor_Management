import { Request, Response, NextFunction } from "express";

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

      const activeBoutique = (req as any).user.activeBoutique.toString();
      const canAccess = ((req as any).user.boutiques || []).some(
        (id: any) => id.toString() === activeBoutique
      );

      if (!canAccess) {
        return res.status(403).json({
          message: "Boutique access denied",
        });
      }

      (req as any).boutiqueId = (req as any).user.activeBoutique;
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
