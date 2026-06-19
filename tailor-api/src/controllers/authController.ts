import { Request, Response } from "express";
import User from "../models/User";
import { generateOTP } from "../utils/otpGenerator";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { sendEmail } from "../utils/emailService";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildOtpEmail = (otp: string) =>
  `Your TailorPro verification code is ${otp}. This code expires in 5 minutes.`;

const userResponse = (user: any) => ({
  id: user._id,
  email: user.email,
  isProfileCompleted: user.isProfileCompleted,
  role: user.role,
  fullName: user.fullName || "",
  phone: user.phone || "",
  boutiques: user.boutiques?.map((b: any) => b.toString()) || [],
  activeBoutique: user.activeBoutique?.toString() || null,
});

const maybeDevOtp = (otp: string) =>
  process.env.RETURN_OTP_IN_RESPONSE === "true" ? { otp } : {};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        role: "owner",
        isProfileCompleted: false,
      });
    }

    if (user.role === "staff" && !user.boutique) {
      return res.status(403).json({
        message: "Staff account is not assigned to a boutique",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    await sendEmail(email, "Your TailorPro OTP", buildOtpEmail(otp));

    return res.json({
      message: "OTP sent successfully",
      ...maybeDevOtp(otp),
    });
  } catch (error: any) {
    console.error("sendOtp error:", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email: rawEmail, otp: rawOtp } = req.body;
    const email = rawEmail?.toString().toLowerCase().trim();
    const otp = rawOtp?.toString().trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const payload = { userId: user._id.toString(), email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      accessToken,
      user: userResponse(user),
    });
  } catch (error: any) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) return res.status(400).json({ message: "Email is required" });

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    await sendEmail(email, "Your TailorPro OTP", buildOtpEmail(otp));

    return res.json({
      message: "OTP resent successfully",
      ...maybeDevOtp(otp),
    });
  } catch (err) {
    console.error("resendOtp error:", err);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
};
