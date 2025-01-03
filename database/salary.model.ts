import { model, models, Schema, Document, Types } from "mongoose";

export interface ISalary {
  staffId: Types.ObjectId;
  branch: Types.ObjectId;
  description: string;
  salaryDate: Date;
  salary: number;
  allowance: number;
  deduction: number;
  exchangeRateD: number;
  exchangeRateT: number;
  netSalary: number;
}
export interface ISalaryDoc extends ISalary, Document {}
const SalarySchema = new Schema<ISalary>(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    salaryDate: { type: Date, default: Date.now() },
    description: { type: String },
    salary: { type: Number, default: 0 },
    allowance: { type: Number, default: 0 },
    deduction: { type: Number, default: 0 },
    exchangeRateD: { type: Number, default: 0 },
    exchangeRateT: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Salary = models?.Salary || model<ISalary>("Salary", SalarySchema);
export default Salary;
