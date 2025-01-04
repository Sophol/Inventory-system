"use server";
import mongoose, { FilterQuery } from "mongoose";

import Salary, { ISalaryDoc } from "@/database/salary.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateSalarySchema,
  EditSalarySchema,
  GetSalarySchema,
  PaginatedSearchParamsSchema,
} from "../validations";

const ObjectId = mongoose.Types.ObjectId;

export async function createSalary(
  params: CreateSalaryParams
): Promise<ActionResponse<ISalaryDoc>> {
  const validatedData = await action({
    params,
    schema: CreateSalarySchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const salary = await Salary.create(validatedData.params);
    return { success: true, data: JSON.parse(JSON.stringify(salary)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function editSalary(
  params: EditSalaryParams
): Promise<ActionResponse<ISalaryDoc>> {
  const validatedData = await action({
    params,
    schema: EditSalarySchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const {
      staffId,
      branch,
      description,
      salaryDate,
      salary,
      allowance,
      deduction,
      exchangeRateD,
      exchangeRateT,
      netSalary,
    } = validatedData.params!;
    const existingSalary = await Salary.findById(params.salaryId);
    if (!salary) {
      return handleError("Salary not found") as ErrorResponse;
    }
    if (existingSalary.staffId != staffId) existingSalary.staffId = staffId;
    if (existingSalary.branch != branch) existingSalary.branch = branch;
    if (existingSalary.description != description)
      existingSalary.description = description;
    if (existingSalary.salaryDate != salaryDate)
      existingSalary.salaryDate = salaryDate;
    if (existingSalary.salary != salary) existingSalary.salary = salary;
    if (existingSalary.allowance != allowance)
      existingSalary.allowance = allowance;
    if (existingSalary.deduction != deduction)
      existingSalary.deduction = deduction;
    if (existingSalary.exchangeRateD != exchangeRateD)
      existingSalary.exchangeRateD = exchangeRateD;
    if (existingSalary.exchangeRateT != exchangeRateT)
      existingSalary.exchangeRateT = exchangeRateT;
    if (existingSalary.netSalary != netSalary)
      existingSalary.netSalary = netSalary;
    existingSalary.save();
    return { success: true, data: JSON.parse(JSON.stringify(existingSalary)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSalary(
  params: GetSalaryParams
): Promise<ActionResponse<ISalaryDoc>> {
  const validatedData = await action({
    params,
    schema: GetSalarySchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const { salaryId } = validatedData.params!;
    const salary = await Salary.aggregate([
      { $match: { _id: new ObjectId(salaryId) } },
      {
        $lookup: {
          from: "users",
          localField: "staffId",
          foreignField: "_id",
          as: "staff",
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$staff" },
      { $unwind: "$branch" },
      {
        $project: {
          _id: 1,
          staffId: { _id: "$staff._id", title: "$staff.username" },
          branch: { _id: "$branch._id", title: "$branch.title" },
          description: 1,
          salaryDate: 1,
          salary: 1,
          allowance: 1,
          deduction: 1,
          exchangeRateD: 1,
          exchangeRateT: 1,
          netSalary: 1,
        },
      },
    ]);

    if (!salary) {
      return handleError("Salary not found") as ErrorResponse;
    }
    return { success: true, data: JSON.parse(JSON.stringify(salary[0])) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getSalaries(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ salaries: ISalaryDoc[]; isNext: boolean }>> {
  const validatedData = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Salary> = {};
  if (query) {
    filterQuery.$or = [
      { description: { $regex: new RegExp(query, "i") } },
      { salary: { $regex: new RegExp(query, "i") } },
      { allowance: { $regex: new RegExp(query, "i") } },
      { deduction: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "description":
      sortCriteria = { description: -1 };
      break;
    case "salary":
      sortCriteria = { salary: -1 };
      break;
    case "allowance":
      sortCriteria = { allowance: -1 };
      break;
    case "deduction":
      sortCriteria = { deduction: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalSalaries, salaries] = await Promise.all([
      Salary.countDocuments(filterQuery),
      Salary.find(filterQuery)
        .populate("staffId", "username")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const isNext = totalSalaries > skip + salaries.length;

    return {
      success: true,
      data: { salaries: JSON.parse(JSON.stringify(salaries)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteSalary(
  params: GetSalaryParams
): Promise<ActionResponse<null>> {
  const validatedData = await action({
    params,
    schema: GetSalarySchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const { salaryId } = validatedData.params!;
  try {
    await Salary.findByIdAndDelete(salaryId);
    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
