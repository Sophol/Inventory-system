"use server";
import mongoose, { FilterQuery } from "mongoose";

import Mission, { IMissionDoc } from "@/database/mission.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateMissionSchema,
  EditMissionSchema,
  GetMissionSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

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
      staffId,
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
    if (existingMission.staffId != staffId) existingMission.staffId = staffId;
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

export async function getMissions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ missions: Mission[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Mission> = {};
  if (query) {
    filterQuery.$or = [
      { description: { $regex: new RegExp(query, "i") } },
      { amount: { $regex: new RegExp(query, "i") } },
    ];
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
    const [totalMissions, missions] = await Promise.all([
      Mission.countDocuments(filterQuery),
      Mission.find(filterQuery)
        .populate("staffId", "username")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const isNext = totalMissions > skip + missions.length;

    return {
      success: true,
      data: { missions: JSON.parse(JSON.stringify(missions)), isNext },
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
