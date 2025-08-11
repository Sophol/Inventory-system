import { model, models, Schema, Document, Types } from "mongoose";

export interface ISale {
  customer: Types.ObjectId;
  branch: Types.ObjectId;
  seller: Types.ObjectId;
  sellerName: string;
  referenceNo: string;
  description: string;
  orderDate: any;
  approvedDate?: any;
  invoicedDate?: any;
  dueDate?: any;
  discount: number;
  tax: number;
  subtotal: number;
  grandtotal: number;
  paid: number;
  balance: number;
  delivery: number;
  paidBy?:
    | "Cash"
    | "ABA Bank"
    | "ACLEDA Bank"
    | "Sathapna Bank"
    | "Vatanak Bank"
    | "Others";
  orderStatus: "pending" | "approved" | "completed";
  paymentStatus: "pending" | "credit" | "completed";
  saleType: "retail" | "wholesale";
  customerType?: "walk-in" | "online";
  facebookName?: string;
  senderPhone?: string;
  recieverPhone?: string;
  location?: string;
  deliveryStatus?: "pending" | "delivered" | "canceled";
  isLogo: string;
}
export interface ISaleDoc extends ISale, Document {}
const SaleSchema = new Schema<ISale>(
  {
    referenceNo: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerName: { type: String },
    orderDate: { type: Date, default: Date.now() },
    approvedDate: { type: Date, default: Date.now() },
    invoicedDate: { type: Date, default: Date.now() },
    dueDate: { type: Date, default: Date.now() },
    description: { type: String },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    delivery: { type: Number, default: 0 },
    grandtotal: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    isLogo: {
      type: String,
      enum: ["true", "false"],
      required: true,
      default: "true",
    },
    paidBy: {
      type: String,
      enum: [
        "Cash",
        "ABA Bank",
        "ACLEDA Bank",
        "Sathapna Bank",
        "Vatanak Bank",
        "Others",
      ],
      required: true,
      default: "Cash",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "approved", "completed", "void"],
      required: true,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "credit", "completed"],
      required: true,
      default: "pending",
    },
    saleType: {
      type: String,
      enum: ["retail", "wholesale"],
      required: true,
      default: "retail",
    },
    customerType: {
      type: String,
      enum: ["walk-in", "online"],
      default: "walk-in",
    },
    facebookName: { type: String },
    senderPhone: { type: String },
    recieverPhone: { type: String },
    location: { type: String },
    deliveryStatus: {
      type: String,
      enum: ["pending", "delivered", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Sale = models?.Sale || model<ISale>("Sale", SaleSchema);
export default Sale;
