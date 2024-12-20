import { model, models, Schema, Document } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  phone?: string;
  image?: string;
  location?: string;
  isStaff: boolean;
  salary: number;
  role: "stock" | "seller" | "admin" | "report" | "branch" | "normal";
}
export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    image: { type: String },
    location: { type: String },
    isStaff: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["stock", "seller", "admin", "report", "branch", "normal"],
      required: true,
      default: "normal",
    },
  },
  { timestamps: true }
);
const User = models?.User || model<IUser>("User", UserSchema);
export default User;
