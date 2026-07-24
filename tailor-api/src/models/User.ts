import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  fullName?: string;
  businessName?: string;
  country?: string;
  userPhoto?: string;

  role: "owner" | "staff";
  
  boutiques?: Types.ObjectId[];
  activeBoutique?: Types.ObjectId;
  boutique?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  staffSkills?: string[];
  weeklyOrderLimit?: number;
  monthlyOrderLimit?: number;

  password?: string;
  otp?: string;
  otpExpires?: Date;
  otpPurpose?: "login" | "signup" | "password-reset";
  isEmailVerified: boolean;
  termsAcceptedAt?: Date;
  welcomeEmailSentAt?: Date;
  deletedAt?: Date;
  isProfileCompleted: boolean;
  isActive: boolean; 
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: String,
    lastName: String,
    phone: String,
    fullName: String,
    businessName: String,
    country: String,
    userPhoto: String,

    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "owner",
    },

    // OWNER
    boutiques: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Boutique",
      },
    ],
    activeBoutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
    },

    boutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    staffSkills: [{ type: String, trim: true }],
    weeklyOrderLimit: { type: Number, default: 10, min: 1 },
    monthlyOrderLimit: { type: Number, default: 40, min: 1 },

    password: {
      type: String,
      select: false,
    },

    otp: String,
    otpExpires: Date,
    otpPurpose: {
      type: String,
      enum: ["login", "signup", "password-reset"],
    },

    isEmailVerified: { type: Boolean, default: true },
    termsAcceptedAt: Date,
    welcomeEmailSentAt: Date,
    deletedAt: Date,

    isProfileCompleted: { type: Boolean, default: false },

    isActive: {
    type: Boolean,
    default: true,
}
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
