import { model, models, Schema, Types, Document } from "mongoose";

export interface IScanQRLog {
  product_qr: Types.ObjectId;
  status: number; // 1: active, 0: inactive
  platform: string;
  version: string;
  lat: number;
  lng: number;
}
export interface IScanQRLogDoc extends IScanQRLog, Document {}
const ScanQRLogSchema = new Schema<IScanQRLog>(
  {
    product_qr: {
      type: Schema.Types.ObjectId,
      ref: "ProductQR",
      required: true,
    },
    status: {
      type: Number,
      default: 1, // 1: active, 0: inactive
      enum: [0, 1],
    },
    platform: {
      type: String,
    },
    version: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  { timestamps: true }
);

const ScanQRLog =
  models?.ScanQRLog || model<IScanQRLog>("ScanQRLog", ScanQRLogSchema);
export default ScanQRLog;
