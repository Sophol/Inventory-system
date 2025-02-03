"use server";
import mongoose, { FilterQuery } from "mongoose";

import { ProductUnit, Sale, SaleDetail, Stock, User } from "@/database";
import { ISaleDetailDoc } from "@/database/sale-detail.model";
import { ISaleDoc } from "@/database/sale.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { convertToSmallUnit } from "../utils";
import {
  CreateSaleSchema,
  EditSaleSchema,
  GetSaleSchema,
  PaginatedSearchParamsSchema,
  PaginatedSearchParamsInvoiceSchema,
  SaleSearchParamsSchema,
} from "../validations";

const ObjectId = mongoose.Types.ObjectId;

export async function createSale(
  params: CreateSaleParams
): Promise<ActionResponse<ISaleDoc>> {
  const validatedData = await action({
    params,
    schema: CreateSaleSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    customer,
    branch,
    referenceNo,
    description,
    saleDate,
    discount,
    subtotal,
    grandtotal,
    paidBy,
    orderStatus,
    paymentStatus,
    saleDetails,
    exchangeRateD,
    exchangeRateT,
    saleType,
    delivery,
    isLogo,
    orderDate,
    seller,
  } = validatedData.params!;
  let sellerId = validatedData?.session?.user?.id;
  let sellerName = validatedData?.session?.user?.name;
  if (seller) {
    const user = await User.findById(new ObjectId(seller));
    sellerId = user?._id;
    sellerName = user?.name;
  }

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const existingSale = await Sale.findOne({ referenceNo });
    if (existingSale) throw new Error("លេខវិកាយ័បត្រ មានរួចហើយ");
    const [sale] = await Sale.create(
      [
        {
          customer: new ObjectId(customer),
          branch: new ObjectId(branch),
          referenceNo,
          description,
          saleDate,
          discount,
          subtotal,
          grandtotal,
          paid: 0,
          balance: grandtotal,
          paidBy,
          delivery,
          orderStatus,
          paymentStatus,
          exchangeRateD,
          exchangeRateT,
          saleType,
          seller: sellerId,
          sellerName,
          isLogo,
          orderDate,
        },
      ],
      { session }
    );
    if (!sale) {
      throw new Error("Failed to create sale");
    }

    const saleDetailDocuments: ISaleDetailDoc[] = [];
    for (const detail of saleDetails) {
      detail.totalPrice =
        (detail.qty ?? 0) * (detail.price ?? 0) - (detail.discount ?? 0);
      detail.totalCost = (detail.qty ?? 0) * (detail.cost ?? 0);
      detail.exchangeRateD = exchangeRateD;
      detail.exchangeRateT = exchangeRateT;
      saleDetailDocuments.push(
        new SaleDetail({
          ...detail,
          sale: sale._id,
        })
      );
    }

    await SaleDetail.insertMany(saleDetailDocuments, { session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(sale)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
export async function editSale(
  params: EditSaleParams
): Promise<ActionResponse<ISaleDoc>> {
  const validatedData = await action({
    params,
    schema: EditSaleSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    saleId,
    customer,
    branch,
    referenceNo,
    description,
    saleDate,
    discount,
    subtotal,
    grandtotal,
    paid,
    paidBy,
    orderStatus,
    paymentStatus,
    saleDetails,
    exchangeRateD,
    exchangeRateT,
    saleType,
    delivery,
    seller,
  } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error("Sale not found");
    }
    let sellerId = validatedData?.session?.user?.id;
    let sellerName = validatedData?.session?.user?.name;
    if (seller) {
      const user = await User.findById(new ObjectId(seller));
      sellerId = user?._id;
      sellerName = user?.name;
    }
    if (sale.customer !== customer) sale.customer = customer;
    if (sale.branch !== branch) sale.branch = branch;
    if (sale.referenceNo !== referenceNo) sale.referenceNo = referenceNo;
    if (sale.description !== description) sale.description = description;
    if (sale.saleDate !== saleDate) sale.saleDate = saleDate;
    if (discount !== sale.discount) sale.discount = discount;
    if (subtotal !== sale.subtotal) sale.subtotal = subtotal;
    if (delivery !== sale.delivery) sale.delivery = delivery;
    if (sellerId !== sale.seller) sale.seller = seller;
    if (sellerName !== sale.sellerName) sale.sellerName = sellerName;
    if (grandtotal !== sale.grandtotal) {
      sale.grandtotal = grandtotal;
      sale.balance = grandtotal;
    }
    if (paid !== sale.paid) sale.paid = paid;

    if (exchangeRateD !== sale.exchangeRateD)
      sale.exchangeRateD = exchangeRateD;
    if (exchangeRateT !== sale.exchangeRateT)
      sale.exchangeRateT = exchangeRateT;
    if (paidBy !== sale.paidBy) sale.paidBy = paidBy;
    if (orderStatus !== sale.orderStatus) sale.orderStatus = orderStatus;
    if (paymentStatus !== sale.paymentStatus)
      sale.paymentStatus = paymentStatus;
    if (saleType !== sale.saleType) sale.saleType = saleType;
    await sale.save({ session });

    if (saleDetails) {
      const newDetailDocuments = [];
      for (const detail of saleDetails) {
        const existingDetail = await SaleDetail.findOne({
          sale: saleId,
          product: detail.product,
          unit: detail.unit,
        }).session(session);
        if (existingDetail) {
          if (detail.qty !== existingDetail.qty)
            existingDetail.qty = detail.qty;
          if (detail.cost !== existingDetail.cost)
            existingDetail.cost = detail.cost;
          if (detail.discount !== existingDetail.discount)
            existingDetail.discount = detail.discount;
          if (detail.description !== existingDetail.description)
            existingDetail.description = detail.description;
          existingDetail.totalPrice =
            (detail.qty ?? 0) * (detail.price ?? 0) - (detail.discount ?? 0);
          existingDetail.totalCost = (detail.qty ?? 0) * (detail.cost ?? 0);
          await existingDetail.save({ session });
        } else {
          detail.totalPrice =
            (detail.qty ?? 0) * (detail.price ?? 0) - (detail.discount ?? 0);
          detail.totalCost = (detail.qty ?? 0) * (detail.cost ?? 0);
          newDetailDocuments.push({ ...detail, sale: saleId });
        }
      }

      const detailsToRemove = await SaleDetail.find({
        sale: saleId,
        $nor: saleDetails.map((d) => ({
          product: d.product,
          unit: d.unit,
        })),
      }).session(session);

      if (detailsToRemove.length > 0) {
        const detailIdsToRemove = [];
        for (const rmd of detailsToRemove) {
          detailIdsToRemove.push(rmd._id);
        }

        await SaleDetail.deleteMany(
          { _id: { $in: detailIdsToRemove } },
          { session }
        );
      }

      if (newDetailDocuments.length > 0) {
        await SaleDetail.insertMany(newDetailDocuments, { session });
      }
    }
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(sale)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function getSale(
  params: GetSaleParams
): Promise<ActionResponse<Sale>> {
  const validatedData = await action({
    params,
    schema: GetSaleSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { saleId } = validatedData.params!;
  try {
    const sale = await Sale.aggregate([
      { $match: { _id: new ObjectId(saleId) } },
      {
        $lookup: {
          from: "saledetails",
          localField: "_id",
          foreignField: "sale",
          as: "details",
        },
      },
      { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "details.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          "details.selectedProduct": {
            _id: "$productDetails._id",
            title: "$productDetails.title",
          },
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "details.unit",
          foreignField: "_id",
          as: "unitDetails",
        },
      },
      { $unwind: { path: "$unitDetails", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          "details.selectedUnit": {
            _id: "$unitDetails._id",
            title: "$unitDetails.title",
          },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: { path: "$customerDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          customer: {
            _id: "$customerDetails._id",
            title: "$customerDetails.name",
          },
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          branch: { _id: "$branchDetails._id", title: "$branchDetails.title" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          seller: {
            _id: "$userDetails._id",
            title: "$userDetails.name",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          referenceNo: { $first: "$referenceNo" },
          customer: { $first: "$customer" },
          branch: { $first: "$branch" },
          seller: { $first: "$seller" },
          orderDate: { $first: "$orderDate" },
          approvedDate: { $first: "$approvedDate" },
          invoicedDate: { $first: "$invoicedDate" },
          dueDate: { $first: "$dueDate" },
          tax: { $first: "$tax" },
          description: { $first: "$description" },
          discount: { $first: "$discount" },
          subtotal: { $first: "$subtotal" },
          delivery: { $first: "$delivery" },
          grandtotal: { $first: "$grandtotal" },
          paid: { $first: "$paid" },
          balance: { $first: "$balance" },
          paidBy: { $first: "$paidBy" },
          saleType: { $first: "$saleType" },
          orderStatus: { $first: "$orderStatus" },
          paymentStatus: { $first: "$paymentStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          saleDetails: { $push: "$details" },
          sellerName: { $first: "$sellerName" },
          isLogo: { $first: "$isLogo" },
        },
      },
    ]);

    if (sale.length === 0) {
      throw new Error("Sale not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(sale[0])) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getSales(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ sales: Sale[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Sale> = {};
  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "referenceNo":
      sortCriteria = { referenceNo: -1 };
      break;
    case "orderStatus":
      sortCriteria = { orderStatus: -1 };
      break;
    case "paymentStatus":
      sortCriteria = { paymentStatus: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalSales, sales] = await Promise.all([
      Sale.countDocuments(filterQuery),
      Sale.find(filterQuery)
        .populate("customer", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const isNext = totalSales > skip + sales.length;
    return {
      success: true,
      data: { sales: JSON.parse(JSON.stringify(sales)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getOrders(
  params: PaginatedSearchParamsInvoice
): Promise<ActionResponse<{ sales: Sale[]; isNext: boolean }>> {
  const validatedData = await action({
    params,
    schema: PaginatedSearchParamsInvoiceSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter, orderStatus } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Sale> = { orderStatus: orderStatus };
  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "referenceNo":
      sortCriteria = { referenceNo: -1 };
      break;
    case "orderStatus":
      sortCriteria = { orderStatus: -1 };
      break;
    case "paymentStatus":
      sortCriteria = { paymentStatus: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalSales, sales] = await Promise.all([
      Sale.countDocuments(filterQuery),
      Sale.find(filterQuery)
        .populate("customer", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);

    const isNext = totalSales > skip + sales.length;
    return {
      success: true,
      data: { sales: JSON.parse(JSON.stringify(sales)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getApprovedOrder(params: SaleSearchParams): Promise<
  ActionResponse<{
    sales: Sale[];
    summary: {
      count: 0;
      totalGrandtotal: 0;
      totalDiscount: 0;
      totalDelivery: 0;
    };
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: SaleSearchParamsSchema,
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
    customerId,
    branchId,
    dateRange,
  } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Sale> = { orderStatus: "approved" };
  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }
  if (customerId) {
    filterQuery.customer = new ObjectId(customerId);
  }

  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }
  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.approvedDate = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }
  let sortCriteria = {};

  switch (filter) {
    case "referenceNo":
      sortCriteria = { referenceNo: -1 };
      break;
    case "orderStatus":
      sortCriteria = { orderStatus: -1 };
      break;
    case "paymentStatus":
      sortCriteria = { paymentStatus: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalSales, sales] = await Promise.all([
      Sale.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            grandtotal: { $sum: "$grandtotal" },
            discount: { $sum: "$discount" },
            delivery: { $sum: "$delivery" },
          },
        },
      ]),
      Sale.find(filterQuery)
        .populate("customer", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const count = totalSales[0]?.count || 0;
    const totalGrandtotal = totalSales[0]?.grandtotal || 0;
    const totalDiscount = totalSales[0]?.discount || 0;
    const totalDelivery = totalSales[0]?.delivery || 0;
    const isNext = count > skip + sales.length;
    const summaryData = {
      count,
      totalGrandtotal,
      totalDiscount,
      totalDelivery,
    };
    return {
      success: true,
      data: {
        sales: JSON.parse(JSON.stringify(sales)),
        summary: JSON.parse(JSON.stringify(summaryData)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPendingOrder(params: SaleSearchParams): Promise<
  ActionResponse<{
    sales: Sale[];
    summary: {
      count: 0;
      totalGrandtotal: 0;
      totalDiscount: 0;
      totalDelivery: 0;
    };
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: SaleSearchParamsSchema,
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
    customerId,
    branchId,
    dateRange,
  } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Sale> = { orderStatus: "pending" };
  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }
  if (customerId) {
    filterQuery.customer = new ObjectId(customerId);
  }

  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }
  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.orderDate = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }
  let sortCriteria = {};

  switch (filter) {
    case "referenceNo":
      sortCriteria = { referenceNo: -1 };
      break;
    case "orderStatus":
      sortCriteria = { orderStatus: -1 };
      break;
    case "paymentStatus":
      sortCriteria = { paymentStatus: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalSales, sales] = await Promise.all([
      Sale.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            grandtotal: { $sum: "$grandtotal" },
            discount: { $sum: "$discount" },
            delivery: { $sum: "$delivery" },
          },
        },
      ]),
      Sale.find(filterQuery)
        .populate("customer", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const count = totalSales[0]?.count || 0;
    const totalGrandtotal = totalSales[0]?.grandtotal || 0;
    const totalDiscount = totalSales[0]?.discount || 0;
    const totalDelivery = totalSales[0]?.delivery || 0;
    const isNext = count > skip + sales.length;
    const summaryData = {
      count,
      totalGrandtotal,
      totalDiscount,
      totalDelivery,
    };
    return {
      success: true,
      data: {
        sales: JSON.parse(JSON.stringify(sales)),
        summary: JSON.parse(JSON.stringify(summaryData)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteSale(
  params: GetSaleParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: GetSaleSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { saleId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error("Sale not found");
    }
    const stockRemoves: { [key: string]: number } = {};
    const detailsToRemove = await SaleDetail.find({ sale: saleId });
    if (detailsToRemove.length > 0) {
      const detailIdsToRemove = [];
      for (const rmd of detailsToRemove) {
        detailIdsToRemove.push(rmd._id);
        const productUnitRm = await ProductUnit.find({
          product: new ObjectId(rmd.product),
        });
        const smallestUnitRm = productUnitRm.find((pu) => pu.level === 1);
        if (!smallestUnitRm) {
          throw new Error(`Smallest unit not found for product ${rmd.product}`);
        }
        // Find the selected unit
        const selectedUnitRm = productUnitRm.find(
          (pu) => pu.unit.toString() === rmd.unit.toString()
        );
        if (!selectedUnitRm) {
          throw new Error(`Selected unit not found for product ${rmd.product}`);
        }
        const existingSmallQtyRm = convertToSmallUnit({
          level: selectedUnitRm.level,
          smallqty: smallestUnitRm.qty,
          selectedQty: selectedUnitRm.qty,
          qty: rmd.qty,
        });
        const deleteStockKeyRm = `${sale.branch}_${rmd.product}_${smallestUnitRm.unit}`;
        if (stockRemoves[deleteStockKeyRm]) {
          stockRemoves[deleteStockKeyRm] += existingSmallQtyRm;
        } else {
          stockRemoves[deleteStockKeyRm] = existingSmallQtyRm;
        }
      }

      // await SaleDetail.deleteMany(
      //   { _id: { $in: detailIdsToRemove } },
      //   { session }
      // );
    }
    for (const [key, qtySmallUnitRm] of Object.entries(stockRemoves)) {
      const [branchId, productId, unitId] = key.split("_");

      const existingStockRm = await Stock.findOne({
        branch: new ObjectId(branchId),
        product: new ObjectId(productId),
        unit: new ObjectId(unitId),
      }).session(session);
      if (existingStockRm) {
        // Update the existing stock entry
        existingStockRm.qtySmallUnit = Math.max(
          0,
          existingStockRm.qtySmallUnit - qtySmallUnitRm
        );

        await existingStockRm.save({ session });
      }
    }
    await Sale.deleteOne({ _id: saleId }).session(session);
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function updateOrderStatus(
  params: GetSaleAndLogoParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: GetSaleSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { saleId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error("Sale not found");
    }
    if (sale.orderStatus !== "pending" && sale.orderStatus !== "approved") {
      return { success: false };
    }

    // Update orderStatus
    if (sale.orderStatus === "pending") {
      sale.orderStatus = "approved";
    } else {
      sale.orderStatus = "completed";
    }

    // Update the isLogo field
    sale.isLogo = params.isLogo;

    await sale.save({});
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
