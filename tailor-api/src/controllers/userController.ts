import { Request, Response } from "express";
import User  from "../models/User";
import Boutique from "../models/Boutique";
import bcrypt from "bcryptjs";

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId).select("-otp -otpExpires");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        isProfileCompleted: user.isProfileCompleted,
        fullName: user.fullName || "",
        phone: user.phone || "",
        role: user.role,
        boutiques: user.boutiques?.map(b => b.toString()) || [], 
        activeBoutique: user.activeBoutique?.toString() || null,  
        userPhoto : user.userPhoto,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const { fullName, phone, userPhoto } = req.body;

    const updateData: any = {
      fullName,
      phone,
    };

    if (userPhoto) {
      updateData.userPhoto = userPhoto;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-otp -otpExpires");
    console.log("Updated user:", user);
    res.json({ message: "Profile updated", user });
  } catch {
    res.status(500).json({ message: "Profile update failed" });
  }
};

export const completeProfile = async (req: any, res: Response) => {
  console.log("Complete profile called", req.body);
  const { fullName, phone, boutiques } = req.body;
  const userId = req.user.userId;

  if (!boutiques || boutiques.length === 0) {
    return res.status(400).json({ message: "At least one boutique required" });
  }

  const createdBoutiques = await Boutique.insertMany(
    boutiques.map((b: any) => ({
      name: b.name,
      owner: userId,
    }))
  );

  const user = await User.findByIdAndUpdate(
    userId,
    {
      fullName,
      phone,
      boutiques: createdBoutiques.map(b => b._id),
      activeBoutique: createdBoutiques[0]._id,
      isProfileCompleted: true,
    },
    { new: true }
  );

  res.json({
    user,
    boutiques: createdBoutiques,
    activeBoutique: createdBoutiques[0],
  });
};


export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId).select("-otp -otpExpires");

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { password, confirmation } = req.body;
    const user = await User.findById(userId).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });
    if (confirmation?.toLowerCase().trim() !== user.email.toLowerCase()) {
      return res.status(400).json({ message: "Type your email exactly to confirm" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "Set a password using Forgot password before deleting this account" });
    }
    if (!password || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    user.isActive = false;
    user.deletedAt = new Date();
    await user.save();

    if (user.role === "owner") {
      await User.updateMany(
        { createdBy: user._id, role: "staff" },
        { $set: { isActive: false } }
      );
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: "/",
    });

    return res.json({ message: "Account deleted" });
  } catch (error) {
    console.error("deleteAccount error:", error);
    return res.status(500).json({ message: "Unable to delete account" });
  }
};
