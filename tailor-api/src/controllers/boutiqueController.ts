import { Request, Response } from "express";
import User from "../models/User";
import Boutique from "../models/Boutique";

export const switchBoutique = async (req: Request, res: Response) => {
  try {
    console.log("Switch boutique called", req.body);
    const { boutiqueId } = req.body;
    const user = (req as any).user;

    console.log("User in switchBoutique:", user);

    if (!user || user.role !== "owner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const currentUser = await User.findById(user.userId);
    if (!currentUser?.boutiques?.includes(boutiqueId)) {
      return res.status(403).json({ message: "Boutique does not belong to you" });
    }

    console.log("Switching active boutique to:", boutiqueId);

    currentUser.activeBoutique = boutiqueId;
    await currentUser.save();

    res.json({
      user: {
        id: currentUser._id,
        email: currentUser.email,
        isProfileCompleted: currentUser.isProfileCompleted,
        fullName: currentUser.fullName || "",
        phone: currentUser.phone || "",
        role: currentUser.role,
        boutiques: currentUser.boutiques?.map(b => b.toString()) || [],
        activeBoutique: currentUser.activeBoutique?.toString() || null,
      },
    });
  } catch (err) {
    console.error("Switch boutique error:", err);
    res.status(500).json({ message: "Failed to switch boutique" });
  }
};


export const getMyBoutiques = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || user.role !== "owner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const boutiques = await Boutique.find({ _id: { $in: user.boutiques } });

    res.json(boutiques);
  } catch (err) {
    console.error("Get my boutiques error:", err);
    res.status(500).json({ message: "Failed to fetch boutiques" });
  }
};

//  Order limit per boutique. 
// export const updateDailyOrderLimit = async (req: Request, res: Response) => {
//   try {
//     const { dailyOrderLimit } = req.body;

//     if (!dailyOrderLimit || dailyOrderLimit < 1) {
//       return res.status(400).json({
//         message: "Daily order limit must be greater than 0",
//       });
//     }

//     const boutique = await Boutique.findByIdAndUpdate(
//       (req as any).boutiqueId,
//       { dailyOrderLimit },
//       { new: true }
//     );

//     res.json({
//       message: "Daily order limit updated",
//       dailyOrderLimit: boutique?.dailyOrderLimit,
//     });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateDailyOrderLimit = async (req: Request, res: Response) => {
  try {
    const { dailyOrderLimit } = req.body;
    const user = (req as any).user;

    if (!dailyOrderLimit || dailyOrderLimit < 1) {
      return res.status(400).json({
        message: "Daily order limit must be greater than 0",
      });
    }

    await Boutique.updateMany(
      { _id: { $in: user.boutiques } },
      { $set: { dailyOrderLimit } }
    );

    res.json({
      message: "Daily order limit updated for all boutiques",
      dailyOrderLimit,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};



export const getActiveBoutique = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    let boutiqueId;

    // OWNER
    if (user.role === "owner") {
      boutiqueId = user.activeBoutique;
    }

    // STAFF
    if (user.role === "staff") {
      boutiqueId = user.boutique;
    }

    if (!boutiqueId) {
      return res.status(400).json({ message: "No boutique found" });
    }

    const boutique = await Boutique.findById(boutiqueId).select("name");

    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    res.json(boutique);
  } catch (error) {
    console.error("getActiveBoutique error:", error);
    res.status(500).json({ message: "Failed to fetch boutique" });
  }
};

export const getDailyOrderLimit = async (req: Request, res: Response) => {
  try {
    const boutique = await Boutique.findById((req as any).boutiqueId);

    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    res.json({
      dailyOrderLimit: boutique.dailyOrderLimit ?? null,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch daily order limit" });
  }
};


