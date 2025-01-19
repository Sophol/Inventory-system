"use server";
import mongoose, { FilterQuery } from "mongoose";

import Mission, { IMissionDoc } from "@/database/mission.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateMissionSchema,
  EditMissionSchema,
  ExpenseSearchParamsSchema,
  GetMissionSchema,
} from "../validations";
import { endOfMonth, startOfMonth } from "date-fns";

const ObjectId = mongoose.Types.ObjectId;

export async function createMission(
  params: CreateMissionParams
): Promise<ActionResponse<IMissionDoc>> {
  const validatedData = await action({
    params,
    schema: CreateMissionSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const mission = await Mission.create(validatedData.params);
    return { success: true, data: JSON.parse(JSON.stringify(mission)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function editMission(
  params: EditMissionParams
): Promise<ActionResponse<IMissionDoc>> {
  const validatedData = await action({
    params,
    schema: EditMissionSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const {
      staffName,
      branch,
      description,
      missionDate,
      amount,
      exchangeRateD,
      exchangeRateT,
    } = validatedData.params!;
    const existingMission = await Mission.findById(params.missionId);
    if (!existingMission) {
      return handleError("Mission not found") as ErrorResponse;
    }
    if (existingMission.staffId != staffName)
      existingMission.staffName = staffName;
    if (existingMission.branch != branch) existingMission.branch = branch;
    if (existingMission.description != description)
      existingMission.description = description;
    if (existingMission.missionDate != missionDate)
      existingMission.missionDate = missionDate;
    if (existingMission.amount != amount) existingMission.amount = amount;
    if (existingMission.exchangeRateD != exchangeRateD)
      existingMission.exchangeRateD = exchangeRateD;
    if (existingMission.exchangeRateT != exchangeRateT)
      existingMission.exchangeRateT = exchangeRateT;
    existingMission.save();
    return { success: true, data: JSON.parse(JSON.stringify(existingMission)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getMission(
  params: GetMissionParams
): Promise<ActionResponse<Mission>> {
  const validatedData = await action({
    params,
    schema: GetMissionSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }

  try {
    const { missionId } = validatedData.params!;
    const mission = await Mission.aggregate([
      { $match: { _id: new ObjectId(missionId) } },

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
          staffName: 1,
          branch: { _id: "$branch._id", title: "$branch.title" },
          description: 1,
          missionDate: 1,
          amount: 1,
          exchangeRateD: 1,
          exchangeRateT: 1,
        },
      },
    ]);

    if (!mission) {
      return handleError("Mission not found") as ErrorResponse;
    }
    return { success: true, data: JSON.parse(JSON.stringify(mission[0])) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getMissions(params: ExpenseSearchParams): Promise<
  ActionResponse<{
    missions: Mission[];
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
  const filterQuery: FilterQuery<typeof Mission> = {};
  if (query) {
    filterQuery.$or = [
      { staffName: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { amount: { $regex: new RegExp(query, "i") } },
    ];
  }
  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }

  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.missionDate = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  } else {
    filterQuery.missionDate = {
      $gte: startOfMonth(new Date()),
      $lte: endOfMonth(new Date()),
    };
  }
  let sortCriteria = {};

  switch (filter) {
    case "staffName":
      sortCriteria = { staffName: -1 };
      break;
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
    const [totalMissions, missions] = await Promise.all([
      Mission.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
      ]),
      Mission.find(filterQuery)
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const count = totalMissions[0]?.count || 0;
    const isNext = count > skip + missions.length;
    const totalAmount = totalMissions[0]?.totalAmount || 0;
    const totalCount = { count, totalAmount };
    return {
      success: true,
      data: {
        missions: JSON.parse(JSON.stringify(missions)),
        summary: JSON.parse(JSON.stringify(totalCount)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteMission(
  params: GetMissionParams
): Promise<ActionResponse<null>> {
  const validatedData = await action({
    params,
    schema: GetMissionSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const { missionId } = validatedData.params!;
  try {
    await Mission.findByIdAndDelete(missionId);
    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
