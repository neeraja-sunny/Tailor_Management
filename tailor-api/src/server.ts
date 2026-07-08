import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import requestLogger from "./middleware/requestLogger";

import { connectDB } from './config/db'

import authRoutes from './routes/authRoutes'
import refreshRoute from './routes/refreshRoute'
import protectedRoutes from './routes/protected'
import userRoutes from './routes/userRoutes'
import customerRoutes from './routes/customerRoutes'
import orderRoutes from './routes/orderRoutes'
import measurementRoutes from './routes/measurementRoutes'
import staffRoutes from './routes/staffRoutes'
import outfitRoutes from './routes/outfitRoutes'
import boutiqueRoutes from './routes/boutiqueRoutes'
import revenueRoutes from './routes/revenueRoutes'
import enquiryRoutes from './routes/enquiryRoutes'
import paymentRoutes from './routes/paymentRoutes'
import reportRoutes from './routes/reportRoutes'
import reminderRoutes from './routes/reminderRoutes'

dotenv.config()
connectDB();

const app = express()

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tailor-pro-umber.vercel.app",
      "https://tailor-management-orcin.vercel.app/",
      // "https://tailor-axz18k1m6-aleeshamufthis-projects.vercel.app",
      /https:\/\/tailor-.*\.vercel\.app$/
    ],
    credentials: true
  })
);

// app.options("*", cors());

app.use(express.json())
app.use(requestLogger);

app.get('/', (_req, res) => res.json({ ok: true, message: 'Tailor API up' }))

app.get('/api/test/testing', (_req, res) => res.json({ ok: true, message: 'Tailor API for testing up' }))

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/outfits", outfitRoutes);
app.use("/api/boutique", boutiqueRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reminders", reminderRoutes);

app.use("/api/token", refreshRoute);
app.use("/api/protected", protectedRoutes);

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
