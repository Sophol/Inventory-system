import { model, models, Schema, Document } from "mongoose";

export interface ICategory {
  title: string;
  description: string;
  status: "active" | "inactive";
}
export interface ICategoryDoc extends ICategory, Document {}
const CategorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
  },
  { timestamps: true }
);
const Category =
  models?.Category || model<ICategory>("Category", CategorySchema);
export default Category;
