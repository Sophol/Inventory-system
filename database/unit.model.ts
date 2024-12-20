import { model, models, Schema, Document } from "mongoose";

export interface IUnit {
  title: string;
  description: string;
  status: "active" | "inactive";
}
export interface IUnitDoc extends IUnit, Document {}
const UnitSchema = new Schema<IUnit>(
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
const Unit = models?.Unit || model<IUnit>("Unit", UnitSchema);
export default Unit;
