import { model, models, Schema, Document, Types } from "mongoose";

export interface IPurchase {
  supplier: Types.ObjectId;
  branch: Types.ObjectId;
  referenceNo: string;
  description: string;
  purchaseDate: Date;
  discount: number;
  subtotal: number;
  grandtoal: number;
  exchangeRateD: number;
  exchangeRateT: number;
  paid: number;
  balance: number;
  paidBy?: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  orderStatus: "pending" | "approved" | "completed";
  paymentStatus: "pending" | "credit" | "completed";
}
export interface IPurchaseDoc extends IPurchase, Document {}
const PurchaseSchema = new Schema<IPurchase>(
  {
    referenceNo: { type: String, required: true, unique: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    purchaseDate: { type: Date, default: Date.now() },
    description: { type: String },
    discount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    grandtoal: { type: Number, default: 0 },
    exchangeRateD: { type: Number, default: 0 },
    exchangeRateT: { type: Number, default: 0 },
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
const Purchase =
  models?.Purchase || model<IPurchase>("Purchase", PurchaseSchema);
export default Purchase;
