"use server";
import mongoose, { FilterQuery } from "mongoose";

import { ProductUnit, Unit } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateUnitSchema,
  EditUnitSchema,
  GetUnitSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function createUnit(
  params: CreateUnitParams
): Promise<ActionResponse<Unit>> {
  const validatedData = await action({
    params,
    schema: CreateUnitSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  try {
    const unit = await Unit.create(validatedData.params);
    return { success: true, data: JSON.parse(JSON.stringify(unit)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function editUnit(
  params: EditUnitParams
): Promise<ActionResponse<Category>> {
  const validatedData = await action({
    params,
    schema: EditUnitSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { title, status, unitId } = validatedData.params!;
  try {
    const unit = await Unit.findById(unitId);
    if (!unit) {
      throw new Error("Unit not found");
    }
    if (unit.title !== title || unit.status !== status) {
      unit.title = title;
      unit.status = status;
      await unit.save();
    }
    return { success: true, data: JSON.parse(JSON.stringify(unit)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUnit(
  params: GetUnitParams
): Promise<ActionResponse<Unit>> {
  const validatedData = await action({
    params,
    schema: GetUnitSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { unitId } = validatedData.params!;
  try {
    const category = await Unit.findById(unitId);
    if (!category) {
      throw new Error("Category not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUnits(
  params: PaginatedSearchParams
): Promise<
  ActionResponse<{ units: Unit[]; totalCount: number; isNext: boolean }>
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
  const filterQuery: FilterQuery<typeof Unit> = {};
  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "title":
      sortCriteria = { title: -1 };
      break;
    case "status":
      sortCriteria = { status: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalUnits, units] = await Promise.all([
      Unit.countDocuments(filterQuery),
      Unit.find(filterQuery).lean().sort(sortCriteria).skip(skip).limit(limit),
    ]);
    const isNext = totalUnits > skip + units.length;

    return {
      success: true,
      data: {
        units: JSON.parse(JSON.stringify(units)),
        totalCount: totalUnits,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteUnit(
  params: GetUnitParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: GetUnitSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { unitId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const unit = await Unit.findById(unitId);
    if (!unit) {
      throw new Error("Unit not found");
    }
    const products = await ProductUnit.findOne({ unit: unitId });

    if (products) {
      throw new Error("Unit បានប្រើរួចហើយ");
    }
    await Unit.deleteOne({ _id: unit._id });
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
