import { model, models, Schema, Document, Types } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  phone?: string;
  image?: string;
  location?: string;
  isStaff: boolean;
  salary: number;
  branch: Types.ObjectId;
  role: "stock" | "seller" | "admin" | "report" | "branch" | "user";
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
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    salary: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["stock", "seller", "admin", "report", "branch", "user"],
      required: true,
      default: "user",
    },
  },
  { timestamps: true }
);
const User = models?.User || model<IUser>("User", UserSchema);
export default User;
