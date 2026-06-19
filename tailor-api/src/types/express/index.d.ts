import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: "owner" | "staff";
        activeBoutique?: Types.ObjectId;
        boutique?: Types.ObjectId;
        boutiques?: Types.ObjectId[];
      };
      boutiqueId?: Types.ObjectId;
    }
  }
}

export {};
