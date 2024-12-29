import { model, models, Schema, Document } from "mongoose";

export interface ISetting {
  companyName: string;
  companyLogo: string;
  address: string;
  phone: string;
  exchangeRateD: number;
  exchangeRateT: number;
}
export interface ISettingDoc extends ISetting, Document {}
const AccountSchema = new Schema<ISetting>(
  {
    companyName: { type: String, required: true },
    companyLogo: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    exchangeRateD: { type: Number, required: true, default: 0 },
    exchangeRateT: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Setting = models?.Setting || model<ISetting>("Setting", AccountSchema);
export default Setting;
