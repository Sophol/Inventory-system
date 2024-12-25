import { model, models, Schema, Document } from "mongoose";

export interface ISupplier {
  companyName: string;
  name: string;
  phone: string;
  email?: string;
  socialLink: string;
  location: string;
  description?: string;
  status: "active" | "inactive";
}
export interface ISupplierDoc extends ISupplier, Document {}
const SupplierSchema = new Schema<ISupplier>(
  {
    companyName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    socialLink: { type: String },
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
const Supplier =
  models?.Supplier || model<ISupplier>("Supplier", SupplierSchema);
export default Supplier;
