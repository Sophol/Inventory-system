"use server";
import mongoose, { FilterQuery } from "mongoose";

import { Customer, Sale } from "@/database";
import { ICustomerDoc } from "@/database/customer.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateCustomerSchema,
  CustomerSearchParamsSchema,
  EditCustomerSchema,
  GetCustomerSchema,
} from "../validations";

export async function createCustomer(
  params: CreateCustomerParams
): Promise<ActionResponse<ICustomerDoc>> {
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
  const {
    name,
    phone,
    email,
    socialLink,
    location,
    description,
    balance,
    saleType,
    status,
    customerId,
    isDepo,
    attachmentUrl,
    province,
    gender,
    idNumber,
    idIssueDate,
    address,
    guarantor1,
    guarantor2,
    product_brand,
  } = validatedData.params!;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    if (
      customer.name !== name ||
      customer.phone !== phone ||
      customer.email !== email ||
      customer.socialLink !== socialLink ||
      customer.location !== location ||
      customer.description !== description ||
      customer.balance !== balance ||
      customer.saleType !== saleType ||
      customer.status !== status ||
      customer.isDepo !== isDepo ||
      customer.attachmentUrl !== attachmentUrl ||
      customer.province !== province ||
      customer.gender !== gender ||
      customer.idNumber !== idNumber ||
      customer.idIssueDate !== idIssueDate ||
      customer.address !== address ||
      customer.product_brand !== product_brand ||
      customer.guarantor1 !== guarantor1 ||
      customer.guarantor2 !== guarantor2
    ) {
      customer.name = name;
      customer.phone = phone;
      customer.email = email;
      customer.socialLink = socialLink;
      customer.location = location;
      customer.description = description;
      customer.balance = balance;
      customer.saleType = saleType;
      customer.status = status;
      customer.isDepo = isDepo;
      customer.attachmentUrl = attachmentUrl;
      customer.province = province;
      customer.gender = gender;
      customer.idNumber = idNumber;
      customer.idIssueDate = idIssueDate;
      customer.address = address;
      customer.product_brand = product_brand;
      customer.guarantor1 = guarantor1;
      customer.guarantor2 = guarantor2;
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

export async function getCustomers(params: CustomerSearchParams): Promise<
  ActionResponse<{
    customers: Customer[];
    summary: { totalBalance: number; count: number };
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: CustomerSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter, isDepo } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Customer> = {};
  if (query) {
    filterQuery.$or = [
      { name: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }
  if (isDepo) {
    filterQuery.isDepo = isDepo;
  }
  let sortCriteria = {};

  switch (filter) {
    case "name":
      sortCriteria = { name: -1 };
      break;
    case "status":
      sortCriteria = { status: -1 };
      break;
    case "balance":
      sortCriteria = { balance: -1 }; // New case for sorting by balance
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [customers, balanceStats] = await Promise.all([
      Customer.aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: "sales",
            localField: "_id",
            foreignField: "customer",
            as: "sales",
          },
        },
        {
          $addFields: {
            balance: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$sales",
                      as: "sale",
                      cond: { $eq: ["$$sale.orderStatus", "completed"] },
                    },
                  },
                  as: "completedSale",
                  in: "$$completedSale.balance",
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            phone: 1,
            location: 1,
            status: 1,
            createdAt: 1,
            balance: 1,
            isDepo: 1,
            attachmentUrl: 1,
            province: 1,
          },
        },
        { $sort: sortCriteria },
        { $sort: { balance: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      // New aggregation to calculate total balance and count
      Customer.aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: "sales",
            localField: "_id",
            foreignField: "customer",
            as: "sales",
          },
        },
        {
          $addFields: {
            balance: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$sales",
                      as: "sale",
                      cond: { $eq: ["$$sale.orderStatus", "completed"] },
                    },
                  },
                  as: "completedSale",
                  in: "$$completedSale.balance",
                },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalBalance: { $sum: "$balance" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);
    const balanceStatistics = balanceStats[0] || { totalBalance: 0, count: 0 };
    const isNext = balanceStatistics.count > skip + customers.length;

    return {
      success: true,
      data: {
        customers: JSON.parse(JSON.stringify(customers)),
        summary: balanceStatistics,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteCustomer(
  params: GetCustomerParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: GetCustomerSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { customerId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const sale = await Sale.findOne({ customer: customerId });

    if (sale) {
      throw new Error("Customer បានប្រើរួចហើយ");
    }
    await Customer.deleteOne({ _id: customer._id });
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
