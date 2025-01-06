import { model, models, Schema, Document, Types } from "mongoose";

export interface IPayment {
  customer: Types.ObjectId;
  branch: Types.ObjectId;
  sale: Types.ObjectId;
  referenceNo: string;
  description: string;
  paymentDate: any;
  creditAmount: number;
  paidAmount: number;
  balance: number;
  paidBy: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  paymentStatus: "pending" | "credit" | "completed";
}
export interface IPaymentDoc extends IPayment, Document {}
const PaymentSchema = new Schema<IPayment>(
  {
    referenceNo: { type: String, required: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    sale: { type: Schema.Types.ObjectId, ref: "Sale", required: true },
    paymentDate: { type: Date, default: Date.now() },
    description: { type: String },
    creditAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    paidBy: {
      type: String,
      enum: ["Cash", "ABA Bank", "ACLEDA Bank", "Others"],
      required: true,
      default: "Cash",
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
const Payment = models?.Payment || model<IPayment>("Payment", PaymentSchema);
export default Payment;
