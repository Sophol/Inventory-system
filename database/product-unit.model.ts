import { model, models, Schema, Types, Document } from "mongoose";

export interface IProductUnit {
  product: Types.ObjectId;
  unit: Types.ObjectId;
  qty: number;
  cost: number;
  price: number;
  wholeSalePrice: number;
  level: number;
}
export interface IProductUnitDoc extends IProductUnit, Document {}
const ProductUnitSchema = new Schema<IProductUnit>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    qty: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  { timestamps: true }
);
const ProductUnit =
  models?.ProductUnit || model<IProductUnit>("ProductUnit", ProductUnitSchema);
export default ProductUnit;
