import { model, models, Schema, Document, Types } from "mongoose";

export interface ISale {
  customer: Types.ObjectId;
  branch: Types.ObjectId;
  referenceNo: string;
  description: string;
  orderDate: any;
  approvedDate?: any;
  invoicedDate?: any;
  discount: number;
  tax: number;
  subtotal: number;
  grandtotal: number;
  paid: number;
  balance: number;
  paidBy?: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  orderStatus: "pending" | "approved" | "completed";
  paymentStatus: "pending" | "credit" | "completed";
}
export interface ISaleDoc extends ISale, Document {}
const SaleSchema = new Schema<ISale>(
  {
    referenceNo: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    orderDate: { type: Date, default: Date.now() },
    approvedDate: { type: Date, default: Date.now() },
    invoicedDate: { type: Date, default: Date.now() },
    description: { type: String },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    grandtotal: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    paidBy: {
      type: String,
      enum: ["Cash", "ABA Bank", "ACLEDA Bank", "Others"],
      required: true,
      default: "Cash",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "approved", "completed"],
      required: true,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "credit", "completed"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);
const Sale = models?.Sale || model<ISale>("Sale", SaleSchema);
export default Sale;
