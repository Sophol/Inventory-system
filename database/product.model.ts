import { model, models, Schema, Types, Document } from "mongoose";

export interface IProduct {
  code: string;
  title: string;
  description?: string;
  image?: string;
  units: Types.ObjectId[];
  category: Types.ObjectId;
  qtyOnHand: number;
  alertQty: number;
  status: "active" | "inactive";
  product_images: string[];
}
export interface IProductDoc extends IProduct, Document {}
const ProductSchema = new Schema<IProduct>(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    units: [{ type: Schema.Types.ObjectId, ref: "Unit" }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    qtyOnHand: { type: Number, default: 0 },
    alertQty: { type: Number, default: 0 },
    product_images: { type: [String] },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
  },
  { timestamps: true }
);

const Product = models?.Product || model<IProduct>("Product", ProductSchema);
export default Product;
