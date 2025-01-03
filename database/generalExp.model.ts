import { model, models, Schema, Document, Types } from "mongoose";

export interface IGeneralExp {
  title: string;
  branch: Types.ObjectId;
  description: string;
  generalDate: Date;
  amount: number;
  exchangeRateD: number;
  exchangeRateT: number;
}
export interface IGeneralExpDoc extends IGeneralExp, Document {}
const GeneralExpSchema = new Schema<IGeneralExp>(
  {
    title: { type: String, required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    generalDate: { type: Date, default: Date.now() },
    description: { type: String },
    amount: { type: Number, default: 0 },
    exchangeRateD: { type: Number, default: 0 },
    exchangeRateT: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const GeneralExp =
  models?.GeneralExp || model<IGeneralExp>("GeneralExp", GeneralExpSchema);
export default GeneralExp;
