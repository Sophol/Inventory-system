import { model, models, Schema, Document } from "mongoose";

export interface IBranch {
  title: string;
  phone: string;
  location: string;
  description: string;
  status: "active" | "inactive";
}
export interface IBranchDoc extends IBranch, Document {}
const BranchSchema = new Schema<IBranch>(
  {
    title: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
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
const Branch = models?.Branch || model<IBranch>("Branch", BranchSchema);
export default Branch;
