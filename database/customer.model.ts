import { model, models, Schema, Document } from "mongoose";

export interface ICustomer {
  companyName: string;
  name: string;
  phone: string;
  email: string;
  social_link: string;
  location: string;
  description: string;
  status: "active" | "inactive";
}
export interface ICustomerDoc extends ICustomer, Document {}
const CustomerSchema = new Schema<ICustomer>(
  {
    companyName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    social_link: { type: String },
    location: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
  },
  { timestamps: true }
);
const Customer =
  models?.Customer || model<ICustomer>("Customer", CustomerSchema);
export default Customer;
