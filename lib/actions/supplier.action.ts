"use server";
import { FilterQuery } from "mongoose";

import { Supplier } from "@/database";
import { ISupplierDoc } from "@/database/supplier.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateSupplierSchema,
  EditSupplierSchema,
  GetSupplierSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function createSupplier(
  params: CreateSupplierParams
): Promise<ActionResponse<ISupplierDoc>> {
  console.log(params);
  const validatedData = await action({
    params,
    schema: CreateSupplierSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  try {
    const supplier = await Supplier.create(validatedData.params);
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function editSupplier(
  params: EditSupplierParams
): Promise<ActionResponse<ISupplierDoc>> {
  const validatedData = await action({
    params,
    schema: EditSupplierSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const {
    companyName,
    name,
    phone,
    email,
    socialLink,
    location,
    description,
    status,
    supplierId,
  } = validatedData.params!;
  try {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    if (
      supplier.companyName !== companyName ||
      supplier.name !== name ||
      supplier.phone !== phone ||
      supplier.email !== email ||
      supplier.socialLink !== socialLink ||
      supplier.location !== location ||
      supplier.description !== description ||
      supplier.status !== status
    ) {
      supplier.companyName = companyName;
      supplier.name = name;
      supplier.phone = phone;
      supplier.email = email;
      supplier.socialLink = socialLink;
      supplier.location = location;
      supplier.description = description;
      supplier.status = status;
      await supplier.save();
    }
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSupplier(
  params: GetSupplierParams
): Promise<ActionResponse<Supplier>> {
  const validatedData = await action({
    params,
    schema: GetSupplierSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { supplierId } = validatedData.params!;
  try {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSuppliers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ suppliers: Supplier[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Supplier> = {};
  if (query) {
    filterQuery.$or = [
      { companyName: { $regex: new RegExp(query, "i") } },
      { name: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "companyName":
      sortCriteria = { companyName: -1 };
      break;
    case "name":
      sortCriteria = { name: -1 };
      break;
    case "status":
      sortCriteria = { status: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalSuppliers, suppliers] = await Promise.all([
      Supplier.countDocuments(filterQuery),
      Supplier.find(filterQuery)
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const isNext = totalSuppliers > skip + suppliers.length;

    return {
      success: true,
      data: { suppliers: JSON.parse(JSON.stringify(suppliers)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
