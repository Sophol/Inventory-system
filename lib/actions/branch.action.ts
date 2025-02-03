"use server";
import { FilterQuery } from "mongoose";

import { Branch } from "@/database";
import { IBranchDoc } from "@/database/branch.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateBranchSchema,
  EditBranchSchema,
  GetBranchSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function createBranch(
  params: CreateBranchParams
): Promise<ActionResponse<IBranchDoc>> {
  const validatedData = await action({
    params,
    schema: CreateBranchSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  try {
    const branch = await Branch.create(validatedData.params);
    return { success: true, data: JSON.parse(JSON.stringify(branch)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function editBranch(
  params: EditBranchParams
): Promise<ActionResponse<IBranchDoc>> {
  const validatedData = await action({
    params,
    schema: EditBranchSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { title, phone, location, description, status, branchId } =
    validatedData.params!;
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      throw new Error("Branch not found");
    }
    if (
      branch.title !== title ||
      branch.phone !== phone ||
      branch.location !== location ||
      branch.description !== description ||
      branch.status !== status
    ) {
      branch.title = title;
      branch.phone = phone;
      branch.location = location;
      branch.description = description;
      branch.status = status;
      await branch.save();
    }
    return { success: true, data: JSON.parse(JSON.stringify(branch)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getBranch(
  params: GetBranchParams
): Promise<ActionResponse<Branch>> {
  const validatedData = await action({
    params,
    schema: GetBranchSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { branchId } = validatedData.params!;
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      throw new Error("Branch not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(branch)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getBranches(
  params: PaginatedSearchParams
): Promise<
  ActionResponse<{ branches: Branch[]; totalCount: number; isNext: boolean }>
> {
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
  const filterQuery: FilterQuery<typeof Branch> = {};
  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { phone: { $regex: new RegExp(query, "i") } },
      { location: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "title":
      sortCriteria = { title: -1 };
      break;
    case "phone":
      sortCriteria = { phone: -1 };
      break;
    case "location":
      sortCriteria = { location: -1 };
      break;
    case "status":
      sortCriteria = { status: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalBranches, branches] = await Promise.all([
      Branch.countDocuments(filterQuery),
      Branch.find(filterQuery)
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const isNext = totalBranches > skip + branches.length;

    return {
      success: true,
      data: {
        branches: JSON.parse(JSON.stringify(branches)),
        totalCount: totalBranches,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
