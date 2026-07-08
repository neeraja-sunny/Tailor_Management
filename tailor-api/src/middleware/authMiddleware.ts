import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    
    let token: string | null = null;

    let decoded: any = null;

    const auth = req.headers.authorization;

    if (auth?.startsWith("Bearer ")) {
      token = auth.split(" ")[1];
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    }

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Bearer access token required" });
    }

    const user = await User.findById(decoded.userId).select(
      "role activeBoutique boutique boutiques isActive"
    );  

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    };

    if (user.isActive === false) {
    return res.status(403).json({ message: "Account disabled" });
    }

    // ✅ FULL user context (IMPORTANT)
    (req as any).user = {
      userId: user._id.toString(),
      role: user.role,
      activeBoutique: user.activeBoutique,
      boutique: user.boutique,
      boutiques: user.boutiques,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
