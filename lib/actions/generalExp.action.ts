"use server";
import mongoose, { FilterQuery } from "mongoose";

import GeneralExp, { IGeneralExpDoc } from "@/database/generalExp.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateGeneralExpSchema,
  EditGeneralExpSchema,
  ExpenseSearchParamsSchema,
  GetGeneralExpSchema,
} from "../validations";

const ObjectId = mongoose.Types.ObjectId;

export async function createGeneralExp(
  params: CreateGeneralExpParams
): Promise<ActionResponse<IGeneralExpDoc>> {
  const validatedData = await action({
    params,
    schema: CreateGeneralExpSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const generalExp = await GeneralExp.create(validatedData.params);
    return { success: true, data: JSON.parse(JSON.stringify(generalExp)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function editGeneralExp(
  params: EditGeneralExpParams
): Promise<ActionResponse<IGeneralExpDoc>> {
  const validatedData = await action({
    params,
    schema: EditGeneralExpSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const {
      title,
      branch,
      description,
      generalDate,
      amount,
      exchangeRateD,
      exchangeRateT,
    } = validatedData.params!;
    const existingGeneralExp = await GeneralExp.findById(params.generalExpId);
    if (!existingGeneralExp) {
      return handleError("General expense not found") as ErrorResponse;
    }
    if (existingGeneralExp.title != title) existingGeneralExp.title = title;
    if (existingGeneralExp.branch != branch) existingGeneralExp.branch = branch;
    if (existingGeneralExp.description != description)
      existingGeneralExp.description = description;
    if (existingGeneralExp.generalDate != generalDate)
      existingGeneralExp.generalDate = generalDate;
    if (existingGeneralExp.amount != amount) existingGeneralExp.amount = amount;
    if (existingGeneralExp.exchangeRateD != exchangeRateD)
      existingGeneralExp.exchangeRateD = exchangeRateD;
    if (existingGeneralExp.exchangeRateT != exchangeRateT)
      existingGeneralExp.exchangeRateT = exchangeRateT;
    existingGeneralExp.save();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(existingGeneralExp)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getGeneralExp(
  params: GetGeneralExpParams
): Promise<ActionResponse<GeneralExp>> {
  const validatedData = await action({
    params,
    schema: GetGeneralExpSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const { generalExpId } = validatedData.params!;
    const generalExp = await GeneralExp.aggregate([
      { $match: { _id: new ObjectId(generalExpId) } },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$branch" },
      {
        $project: {
          _id: 1,
          title: 1,
          branch: { _id: "$branch._id", title: "$branch.title" },
          description: 1,
          generalDate: 1,
          amount: 1,
          exchangeRateD: 1,
          exchangeRateT: 1,
        },
      },
    ]);

    if (!generalExp) {
      return handleError("General expense not found") as ErrorResponse;
    }
    return { success: true, data: JSON.parse(JSON.stringify(generalExp[0])) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getGeneralExps(params: ExpenseSearchParams): Promise<
  ActionResponse<{
    generalExps: GeneralExp[];
    summary: { count: 0; totalAmount: 0 };
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: ExpenseSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const {
    page = 1,
    pageSize = 10,
    query,
    filter,
    branchId,
    dateRange,
  } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof GeneralExp> = {};
  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { amount: { $regex: new RegExp(query, "i") } },
    ];
  }
  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }

  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.generalDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
  }
  let sortCriteria = {};

  switch (filter) {
    case "description":
      sortCriteria = { description: -1 };
      break;
    case "amount":
      sortCriteria = { amount: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalGeneralExps, generalExps] = await Promise.all([
      GeneralExp.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
      ]),
      GeneralExp.find(filterQuery)
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const count = totalGeneralExps[0]?.count || 0;
    const isNext = count > skip + generalExps.length;
    const totalAmount = totalGeneralExps[0]?.totalAmount || 0;

    const totalCount = { count, totalAmount };
    return {
      success: true,
      data: {
        generalExps: JSON.parse(JSON.stringify(generalExps)),
        summary: JSON.parse(JSON.stringify(totalCount)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteGeneralExp(
  params: GetGeneralExpParams
): Promise<ActionResponse<null>> {
  const validatedData = await action({
    params,
    schema: GetGeneralExpSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const { generalExpId } = validatedData.params!;
  try {
    await GeneralExp.findByIdAndDelete(generalExpId);
    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
