import express, { response } from "express";
import { sendOtp, verifyOtp, resendOtp } from "../controllers/authController";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);


router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",   
    secure: true,   
    path: "/", 
  });
  return res.json({ message: "Logged out successfully" });
});

export default router;
