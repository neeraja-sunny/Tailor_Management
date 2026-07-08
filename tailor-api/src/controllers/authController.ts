import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Boutique from "../models/Boutique";
import { generateOTP } from "../utils/otpGenerator";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { sendEmail } from "../utils/emailService";
import { buildOtpEmail, buildWelcomeEmail } from "../utils/emailTemplates";

const OTP_TTL = 5 * 60 * 1000;
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password: string) =>
  password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
const normalizeEmail = (value: unknown) => value?.toString().toLowerCase().trim() || "";
const normalizePhone = (value: unknown) => value?.toString().replace(/[\s()-]/g, "").trim() || "";
const maybeDevOtp = (otp: string) =>
  process.env.RETURN_OTP_IN_RESPONSE === "true" ? { otp } : {};

const userResponse = (user: any) => ({
  id: user._id,
  email: user.email,
  isProfileCompleted: user.isProfileCompleted,
  role: user.role,
  fullName: user.fullName || "",
  phone: user.phone || "",
  boutiques: user.boutiques?.map((boutique: any) => boutique.toString()) || [],
  activeBoutique: user.activeBoutique?.toString() || null,
});

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const createSession = (user: any, res: Response) => {
  const payload = { userId: user._id.toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  setRefreshCookie(res, generateRefreshToken(payload));
  return { accessToken, user: userResponse(user) };
};

const setOtp = async (user: any, purpose: "login" | "signup" | "password-reset") => {
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + OTP_TTL);
  user.otpPurpose = purpose;
  await user.save();
  return otp;
};

const validateOtp = (user: any, otp: string, purpose: string) => {
  if (user.otpPurpose !== purpose) return "Request a new verification code";
  if (!user.otpExpires || user.otpExpires < new Date()) return "OTP expired";
  if (user.otp !== otp) return "Invalid OTP";
  return null;
};

const sendWelcomeEmailIfNeeded = async (user: any) => {
  if (user.role !== "owner" || user.welcomeEmailSentAt) return;

  // Retry only for recently created accounts so older users do not receive a surprise welcome email.
  const registrationDate = user.termsAcceptedAt || user.createdAt;
  const registeredAt = registrationDate ? new Date(registrationDate).getTime() : Date.now();
  if (Date.now() - registeredAt > 7 * 24 * 60 * 60 * 1000) return;

  try {
    await sendEmail(
      user.email,
      `Welcome to TailorPro, ${user.firstName || "there"}!`,
      buildWelcomeEmail(user.firstName || "there", user.businessName || "your business"),
    );
    user.welcomeEmailSentAt = new Date();
    await user.save();
  } catch (emailError) {
    // Leave welcomeEmailSentAt empty so the next successful login retries delivery.
    console.error("welcome email error:", emailError);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);
    const { firstName, lastName, businessName, country, password, confirmPassword, acceptTerms } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email || !businessName?.trim() || !country?.trim() || !phone) {
      return res.status(400).json({ message: "Complete all required fields" });
    }
    if (!isValidEmail(email)) return res.status(400).json({ message: "Enter a valid email address" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
    if (!isStrongPassword(password || "")) {
      return res.status(400).json({ message: "Password must be 8+ characters with uppercase, lowercase, and a number" });
    }
    if (acceptTerms !== true) return res.status(400).json({ message: "You must accept the terms" });

    let user = await User.findOne({ email }).select("+password");
    if (user?.isEmailVerified) return res.status(409).json({ message: "An account already exists for this email" });

    const values = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      email,
      phone,
      businessName: businessName.trim(),
      country: country.trim(),
      password: await bcrypt.hash(password, 12),
      role: "owner" as const,
      isEmailVerified: false,
      isProfileCompleted: false,
      termsAcceptedAt: new Date(),
      isActive: true,
    };

    if (user) Object.assign(user, values);
    else user = new User(values);

    const otp = await setOtp(user, "signup");
    await sendEmail(email, "Verify your TailorPro account", buildOtpEmail(otp, "signup"));
    return res.status(201).json({ message: "Verification code sent", ...maybeDevOtp(otp) });
  } catch (error) {
    console.error("signup error:", error);
    return res.status(500).json({ message: "Unable to create account" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const identifier = req.body.identifier?.toString().trim();
    const password = req.body.password?.toString() || "";
    if (!identifier || !password) return res.status(400).json({ message: "Email or phone and password are required" });

    const user = await User.findOne({
      $or: [{ email: normalizeEmail(identifier) }, { phone: normalizePhone(identifier) }],
    }).select("+password");
    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email, phone, or password" });
    }
    if (!user.isActive) return res.status(403).json({ message: "Account disabled" });
    if (!user.isEmailVerified) return res.status(403).json({ message: "Verify your email before signing in" });
    if (user.role === "staff" && !user.boutique) return res.status(403).json({ message: "Staff account is not assigned to a boutique" });
    await sendWelcomeEmailIfNeeded(user);
    return res.json({ message: "Login successful", ...createSession(user, res) });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: "Unable to sign in" });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!isValidEmail(email)) return res.status(400).json({ message: "Enter a valid email address" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Create an account first" });
    if (!user.isActive) return res.status(403).json({ message: "Account disabled" });
    if (user.role === "staff" && !user.boutique) return res.status(403).json({ message: "Staff account is not assigned to a boutique" });

    const purpose = user.isEmailVerified ? "login" : "signup";
    const otp = await setOtp(user, purpose);
    await sendEmail(email, "Your TailorPro verification code", buildOtpEmail(otp, purpose));
    return res.json({ message: "OTP sent successfully", ...maybeDevOtp(otp) });
  } catch (error) {
    console.error("sendOtp error:", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = req.body.otp?.toString().trim();
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otpPurpose === "password-reset") return res.status(400).json({ message: "Use this code on the reset-password form" });

    const purpose = user.otpPurpose === "signup" ? "signup" : "login";
    const otpError = validateOtp(user, otp, purpose);
    if (otpError) return res.status(400).json({ message: otpError });

    if (purpose === "signup") {
      const boutique = await Boutique.create({ name: user.businessName || "My Boutique", owner: user._id });
      user.boutiques = [boutique._id as any];
      user.activeBoutique = boutique._id as any;
      user.isEmailVerified = true;
      user.isProfileCompleted = true;
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;
    await user.save();

    await sendWelcomeEmailIfNeeded(user);

    if (purpose === "signup") {
      return res.json({
        message: "Account created successfully. Please sign in.",
        accountCreated: true,
      });
    }

    return res.json({ message: "Verification successful", ...createSession(user, res) });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

export const resendOtp = async (req: Request, res: Response) => sendOtp(req, res);

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!isValidEmail(email)) return res.status(400).json({ message: "Enter a valid email address" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account exists for this email" });
    const otp = await setOtp(user, "password-reset");
    await sendEmail(email, "Reset your TailorPro password", buildOtpEmail(otp, "password-reset"));
    return res.json({ message: "Reset code sent", ...maybeDevOtp(otp) });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ message: "Unable to send reset code" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = req.body.otp?.toString().trim();
    const { password, confirmPassword } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
    if (!isStrongPassword(password || "")) {
      return res.status(400).json({ message: "Password must be 8+ characters with uppercase, lowercase, and a number" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const otpError = validateOtp(user, otp, "password-reset");
    if (otpError) return res.status(400).json({ message: otpError });

    user.password = await bcrypt.hash(password, 12);
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;
    await user.save();
    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Unable to reset password" });
  }
};
