import { model, models, Schema, Document, Types } from "mongoose";

export interface IPurchaseDetail {
  purchase: Types.ObjectId;
  product: Types.ObjectId;
  unit: Types.ObjectId;
  discount: number;
  qty: number;
  cost: number;
  total: number;
  description: string;
  exchangeRateD: number;
  exchangeRateT: number;
}
export interface IPurchaseDetailDoc extends IPurchaseDetail, Document {}
const PurchaseDetailSchema = new Schema<IPurchaseDetail>(
  {
    purchase: { type: Schema.Types.ObjectId, ref: "Purchase", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    description: { type: String },
    discount: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    exchangeRateD: { type: Number, default: 0 },
    exchangeRateT: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const PurchaseDetail =
  models?.PurchaseDetail ||
  model<IPurchaseDetail>("PurchaseDetail", PurchaseDetailSchema);
export default PurchaseDetail;
