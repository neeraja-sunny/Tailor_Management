// routes/refreshRoute.ts
import express from "express";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/token";

const router = express.Router();

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const payload = { userId: decoded.userId, email: decoded.email };

    const accessToken = generateAccessToken(payload);
    return res.json({ accessToken });
  } catch (err) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

export default router;
