import User from "../models/User";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import OrderItem from "../models/OrderItem";

const cleanSkills = (value: unknown) => Array.from(new Set(
  (Array.isArray(value) ? value : [])
    .map((skill) => String(skill).trim().toLowerCase())
    .filter(Boolean)
));

export const addStaff = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.userId;

    const boutiqueId = (req as any).user.activeBoutique;

    if (!boutiqueId) {
      return res.status(400).json({ message: "No active boutique selected" });
    }

    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const email = req.body.email?.toLowerCase().trim();
    const { name, phone, staffSkills, weeklyOrderLimit, monthlyOrderLimit } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    const existing = await User.findOne({ email });

// 🔁 Reactivate soft-deleted staff
if (existing && existing.role === "staff" && !existing.isActive) {
  existing.isActive = true;
  existing.phone = phone;
  existing.boutique = boutiqueId;
  existing.createdBy = ownerId;
  existing.fullName = name?.trim() || existing.fullName;
  existing.staffSkills = cleanSkills(staffSkills);
  existing.weeklyOrderLimit = Math.max(Number(weeklyOrderLimit) || 10, 1);
  existing.monthlyOrderLimit = Math.max(Number(monthlyOrderLimit) || 40, 1);

  await existing.save();

  return res.json({
    message: "Staff reactivated successfully",
    staff: {
      id: existing._id,
      email: existing.email,
    },
  });
}

// ❌ Block truly existing active users
if (existing) {
  return res.status(400).json({ message: "Email already exists" });
}

    const staff = await User.create({
      email,
      fullName: name?.trim(),
      phone,
      staffSkills: cleanSkills(staffSkills),
      weeklyOrderLimit: Math.max(Number(weeklyOrderLimit) || 10, 1),
      monthlyOrderLimit: Math.max(Number(monthlyOrderLimit) || 40, 1),
      role: "staff",
      createdBy: ownerId,
      boutique: boutiqueId,
      isProfileCompleted: false,
      isActive: true,
    });

    console.log("Created staff:", staff);

    res.json({
      message: "Staff created",
      staff: {
        id: staff._id,
        email: staff.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getStaff = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.userId;

    const boutiqueId = (req as any).user.activeBoutique;

    if (!boutiqueId) {
      return res.status(400).json({ message: "No active boutique selected" });
    }

    const staff = await User.find({
      role: "staff",
      boutique: boutiqueId,
      createdBy: ownerId, 
      isActive: true
    }).select("phone email fullName staffSkills weeklyOrderLimit monthlyOrderLimit").lean();

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const staffWithWorkload = await Promise.all(staff.map(async (member: any) => {
      const [weeklyAssigned, monthlyAssigned] = await Promise.all([
        OrderItem.countDocuments({ boutique: boutiqueId, workAssignments: { $elemMatch: { staff: member._id, assignedAt: { $gte: startOfWeek } } } }),
        OrderItem.countDocuments({ boutique: boutiqueId, workAssignments: { $elemMatch: { staff: member._id, assignedAt: { $gte: startOfMonth } } } }),
      ]);
      return { ...member, weeklyAssigned, monthlyAssigned };
    }));

    res.json({ staff: staffWithWorkload });
  } catch {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};


export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.userId;
    const boutiqueId = (req as any).user.activeBoutique;
    const { staffId } = req.params;

    if (!boutiqueId) {
      return res.status(400).json({ message: "No active boutique selected" });
    }

    const staff = await User.findOne({
      _id: staffId,
      role: "staff",
      createdBy: ownerId,
      boutique: boutiqueId,
      isActive: true,
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // SOFT DELETE
    staff.isActive = false;
    await staff.save();

    res.json({ message: "Staff removed successfully" });
  } catch (error) {
    console.error("deleteStaff error:", error);
    res.status(500).json({ message: "Failed to delete staff" });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.userId;
    const boutiqueId = (req as any).user.activeBoutique;
    const { staffId } = req.params;
    const staff = await User.findOne({ _id: staffId, role: "staff", createdBy: ownerId, boutique: boutiqueId, isActive: true });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    if (req.body.fullName !== undefined) staff.fullName = String(req.body.fullName).trim();
    if (req.body.phone !== undefined) staff.phone = String(req.body.phone).trim();
    if (req.body.staffSkills !== undefined) staff.staffSkills = cleanSkills(req.body.staffSkills);
    if (req.body.weeklyOrderLimit !== undefined) staff.weeklyOrderLimit = Math.max(Number(req.body.weeklyOrderLimit) || 1, 1);
    if (req.body.monthlyOrderLimit !== undefined) staff.monthlyOrderLimit = Math.max(Number(req.body.monthlyOrderLimit) || 1, 1);
    await staff.save();
    return res.json({ message: "Staff settings updated", staff });
  } catch (error) {
    console.error("updateStaff error:", error);
    return res.status(500).json({ message: "Failed to update staff" });
  }
};
