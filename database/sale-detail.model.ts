import { model, models, Schema, Document, Types } from "mongoose";

export interface ISaleDetail {
  sale: Types.ObjectId;
  product: Types.ObjectId;
  unit: Types.ObjectId;
  discount: number;
  qty: number;
  cost: number;
  price: number;
  totalCost: number;
  totalPrice: number;
  description: string;
}
export interface ISaleDetailDoc extends ISaleDetail, Document {}
const SaleDetailSchema = new Schema<ISaleDetail>(
  {
    sale: { type: Schema.Types.ObjectId, ref: "Sale", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    description: { type: String },
    discount: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const SaleDetail =
  models?.SaleDetail || model<ISaleDetail>("SaleDetail", SaleDetailSchema);
export default SaleDetail;
