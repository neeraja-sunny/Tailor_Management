// routes/refreshRoute.ts
import express from "express";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/token";

const router = express.Router();

console.log("✅ Refresh API hit");


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
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

export default router;