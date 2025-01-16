import { model, models, Schema, Document, Types } from "mongoose";

export interface IMission {
  staffName: string;
  branch: Types.ObjectId;
  description: string;
  missionDate: Date;
  amount: number;
  exchangeRateD: number;
  exchangeRateT: number;
}
export interface IMissionDoc extends IMission, Document {}
const MissionSchema = new Schema<IMission>(
  {
    staffName: { type: String, required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    missionDate: { type: Date, default: Date.now() },
    description: { type: String },
    amount: { type: Number, default: 0 },
    exchangeRateD: { type: Number, default: 0 },
    exchangeRateT: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Mission = models?.Mission || model<IMission>("Mission", MissionSchema);
export default Mission;
