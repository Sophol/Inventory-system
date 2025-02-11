import { model, models, Schema, Document } from "mongoose";

export interface ICustomer {
  name: string;
  phone: string;
  email?: string;
  socialLink: string;
  location: string;
  description: string;
  saleType: "retail" | "wholesale";
  balance: number;
  status: "active" | "inactive";
  isDepo: boolean;
  attachmentUrl?: string;
  province: string;
  gender: "male" | "female";
  idNumber?: string;
  idIssueDate?: Date;
  address?: string;
  guarantor1?: string;
  guarantor2?: string;
  product_brand?: string;
}
export interface ICustomerDoc extends ICustomer, Document {}
const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    socialLink: { type: String },
    location: { type: String },
    description: { type: String },
    balance: { type: Number, default: 0 },
    attachmentUrl: { type: String },
    province: { type: String },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
      default: "male",
    },
    idNumber: { type: String },
    idIssueDate: { type: Date },
    address: { type: String },
    guarantor1: { type: String },
    guarantor2: { type: String },
    product_brand: { type: String },
    saleType: {
      type: String,
      enum: ["retail", "wholesale"],
      required: true,
      default: "retail",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
    isDepo: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Customer =
  models?.Customer || model<ICustomer>("Customer", CustomerSchema);
export default Customer;
