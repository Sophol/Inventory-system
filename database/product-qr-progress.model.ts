import { model, models, Schema, Document } from "mongoose";

export interface IProductQRProgress {
  status: number; // 1: active, 0: inactive
  product_code: string;
  product_name: string;
  generated_year: number;
  end_number?: number;
}
export interface IProductQRProgressDoc extends IProductQRProgress, Document {}
const ProductQRProgressSchema = new Schema<IProductQRProgress>(
  {
    status: {
      type: Number,
      default: 1, // 1: active, 0: inactive
      enum: [0, 1],
    },
    product_code: {
      type: String,
      required: true,
      index: true,
    },
    product_name: {
      type: String,
      required: true,
      index: true,
    },
    generated_year: {
      type: Number,
      default: () => new Date().getFullYear(),
      index: true,
    },
    end_number: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
ProductQRProgressSchema.index(
  { product_code: 1, generated_year: 1 },
  { unique: true }
);
const ProductQRProgress =
  models?.ProductQRProgress ||
  model<IProductQRProgress>("ProductQRProgress", ProductQRProgressSchema);
export default ProductQRProgress;
