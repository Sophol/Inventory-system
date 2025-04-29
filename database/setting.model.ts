import { model, models, Schema, Document } from "mongoose";

export interface ISetting {
  companyName: string;
  companyNameEnglish: string;
  companyLogo: string;
  address: string;
  phone: string;
  companyOwner: string;
  vat_number: string;
  exchangeRateD: number;
  exchangeRateT: number;
  bankName?: string;
  bankAccount?: string;
  bankNumber?: string;
  phone1?: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  telegram?: string;
  tiktok?: string;
  lat?: number;
  lng?: number;
}
export interface ISettingDoc extends ISetting, Document {}
const AccountSchema = new Schema<ISetting>(
  {
    companyName: { type: String, required: true },
    companyNameEnglish: { type: String, required: true },
    companyLogo: { type: String, required: true },
    companyOwner: { type: String },
    vat_number: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    bankName: { type: String },
    bankAccount: { type: String },
    bankNumber: { type: String },
    exchangeRateD: { type: Number, required: true, default: 0 },
    exchangeRateT: { type: Number, required: true, default: 0 },
    phone1: { type: String },
    email: { type: String, required: true, unique: true },
    facebook: { type: String },
    website: { type: String },
    instagram: { type: String },
    tiktok: { type: String },
    telegram: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

const Setting = models?.Setting || model<ISetting>("Setting", AccountSchema);
export default Setting;
