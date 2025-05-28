import { model, models, Schema, Document } from "mongoose";

export interface IProductQR {
  raw_serial: string;
  encrypt_serial?: string;
  status: number; // 1: active, 0: inactive
  viewer_count: number;
  product_code: string;
  product_name: string;
  is_print: boolean;
  generated_year: number;
  invalid_date: Date;
  expired_date: Date | null;
  remarks?: string | null;
  end_number?: number;
}
export interface IProductQRDoc extends IProductQR, Document {}
const ProductQRSchema = new Schema<IProductQR>(
  {
    raw_serial: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    encrypt_serial: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1, // 1: active, 0: inactive
      enum: [0, 1],
    },
    viewer_count: {
      type: Number,
      default: 0,
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
    is_print: {
      type: Boolean,
      default: false,
    },
    generated_year: {
      type: Number,
      default: () => new Date().getFullYear(),
      index: true,
    },
    invalid_date: {
      type: Date,
      default: Date.now,
    },
    expired_date: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      default: null,
    },
    end_number: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
ProductQRSchema.index({ product_code: 1, generated_year: 1, raw_serial: 1 });
const ProductQR =
  models?.ProductQR || model<IProductQR>("ProductQR", ProductQRSchema);
export default ProductQR;
