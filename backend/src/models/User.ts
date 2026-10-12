import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'FARMER' | 'BUYER' | 'ADMIN';
export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED';
export type AccountStatus = 'ACTIVE' | 'BLOCKED';

export interface FarmDetails {
  village?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  farmSize?: string;
  farmType?: string;
  crops?: string[];
}

export interface BusinessDetails {
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  city?: string;
  address?: string;
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  location: string;
  isActive: boolean;
  isVerified: boolean;
  status: AccountStatus;
  kycStatus: KycStatus;
  farmDetails?: FarmDetails;
  businessDetails?: BusinessDetails;
  rejectionReason?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: { type: String, required: true, trim: true, maxlength: 15 },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['FARMER', 'BUYER', 'ADMIN'], required: true },
  location: { type: String, trim: true, maxlength: 200 },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' },
  kycStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'NOT_SUBMITTED'],
    default: 'NOT_SUBMITTED',
  },
  farmDetails: {
    village: String,
    district: String,
    state: String,
    pinCode: String,
    farmSize: String,
    farmType: String,
    crops: [String],
  },
  businessDetails: {
    businessName: String,
    businessType: String,
    gstNumber: String,
    city: String,
    address: String,
  },
  rejectionReason: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
