import { model, models, Schema, Document, Types } from "mongoose";

export interface IStock {
  branch: Types.ObjectId;
  product: Types.ObjectId;
  unit: Types.ObjectId;
  qtySmallUnit: number;
  cost: number;
  price: number;
}
export interface IStockDoc extends IStock, Document {}
const StockSchema = new Schema<IStock>(
  {
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    qtySmallUnit: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Stock = models?.Stock || model<IStock>("Stock", StockSchema);
export default Stock;
