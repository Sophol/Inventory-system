"use server";
import { Customer } from "@/database";
import { ICustomerDoc } from "@/database/customer.model";
import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateCustomerSchema,
  EditCustomerSchema,
  GetCustomerSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function createCustomer(
  params: CreateCustomerParams
): Promise<ActionResponse<ICustomerDoc>> {
  console.log(params);
  const validatedData = await action({
    params,
    schema: CreateCustomerSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  try {
    const customer = await Customer.create(validatedData.params);
    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function editCustomer(
  params: EditCustomerParams
): Promise<ActionResponse<ICustomerDoc>> {
  const validatedData = await action({
    params,
    schema: EditCustomerSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  console.log(params);
  // eslint-disable-next-line camelcase
  const { name, status, phone, email, social_link, location, description, saleType, balance,customerId } = validatedData.params!;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    if (customer.name !== name || customer.status !== status || customer.phone !== phone ||
      // eslint-disable-next-line camelcase
      customer.email !== email || customer.social_link !== social_link || customer.location !== location ||
      customer.saleType !== saleType || customer.balance !== balance || customer.description !== description
    ) {
      customer.name = name;
      customer.phone = phone;
      customer.email = email;
      // eslint-disable-next-line camelcase
      customer.social_link = social_link;
      customer.description = description;
      customer.location = location;
      customer.balance = balance;
      customer.saleType = saleType;
      customer.status = status;
      await customer.save();
    }
    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getCustomer(
  params: GetCustomerParams
): Promise<ActionResponse<Customer>> {
  const validatedData = await action({
    params,
    schema: GetCustomerSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { customerId } = validatedData.params!;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(customer)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getCustomers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ customers: Customer[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Customer> = {};
  if (query) {
    filterQuery.$or = [
      { name: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};
  switch (filter) {
    case "name":
      sortCriteria = { status: -1 };
      break;
    case "status":
      sortCriteria = { status: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalCustomers, customers] = await Promise.all([
      Customer.countDocuments(filterQuery),
      Customer.find(filterQuery)
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const isNext = totalCustomers > skip + customers.length;

    return {
      success: true,
      data: { customers: JSON.parse(JSON.stringify(customers)), isNext },
    };
  } catch (error) {

    return handleError(error) as ErrorResponse;
  }
}
