"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { format } from "date-fns";
import { formatCurrency } from '@/lib/utils';

export const SaleReportColumn: ColumnDef<Sale>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference No" className="flex justify-center whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const referenceNo = row.getValue("referenceNo") as string;
      return <span className="flex justify-center  whitespace-nowrap ">{referenceNo}</span>;
    },
  },
  {
    accessorKey: "invoicedDate", // Assuming saleDate is the date field you want to format
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" className="flex justify-center whitespace-nowrap"/>
    ),
    cell: ({ row }) => {
      const date = row.getValue("invoicedDate") as string;
      const formattedDate = format(new Date(date), "dd/MM/yyyy hh:mm:ss "); // Customize format as needed
      return <span className="text-[9px] whitespace-nowrap flex justify-center">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" className="text-center whitespace-nowrap text-[9px] " />
    ),
    cell: ({ row }) => (
      <div className="text-center whitespace-nowrap text-[9px] ">
        {row.original.customer?.name ?? "N/A"}
      </div>
    ),
  },
  
  
  {
    accessorKey: "branch.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" className="flex justify-center"/>
    ),
    cell: ({ row }) => {
      const branch = row.original.branch.title as string;
      return <span className="text-[9px] whitespace-nowrap justify-center flex">{branch}</span>;
    },
  },
  {
     accessorKey: "grandtotal",
     header: ({ column }) => (
       <DataTableColumnHeader column={column} title="Grand Total" className="flex justify-center"/>
     ),
     cell: ({ row }) => {
       const grandtotal = row.getValue("grandtotal") as number;
       return <span className="flex justify-end  whitespace-nowrap text-right px-4">{formatCurrency(grandtotal)}</span>;
     },
   },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" className="flex whitespace-nowrap justify-center px-4"/>
    ),
    cell: ({ row }) => {
      const discount = row.getValue("discount") as number;
      return <span className="flex justify-end  whitespace-nowrap px-4">{formatCurrency(discount)}</span>;
    },
  },
  {
    accessorKey: "delivery",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery" className="flex justify-center whitespace-nowrap px-4"/>
    ),
    cell: ({ row }) => {
      const delivery = row.getValue("delivery") as number;
      return <span  className="flex justify-end whitespace-nowrap px-4">{formatCurrency(delivery)}</span>;
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" className="flex justify-center whitespace-nowrap px-4"/>
    ),
    cell: ({ row }) => {
      const paid = row.getValue("paid") as number;
      return <span className="flex justify-end whitespace-nowrap px-4">{formatCurrency(paid)}</span>;
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" className="flex justify-center px-4" />
    ),
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number;
      return <span className="flex justify-end  whitespace-nowrap px-4">{formatCurrency(balance)}</span>;
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" className="flex justify-center whitespace-nowrap"/>
    ),
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return (
        <Badge
        className={
          status === "completed"
            ? "bg-green-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
            : status === "approved"
              ? "bg-blue-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
              : status === "pending"
                ? "bg-yellow-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto" 
                : "bg-red-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
        }
      >
        {status}
      </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment" className="flex justify-center"/>
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
        className={
          status === "completed"
            ? "bg-green-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
            : status === "approved"
              ? "bg-blue-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
              : status === "pending"
                ? "bg-yellow-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto" 
                : "bg-red-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
        }
      >
        {status}
      </Badge>
      );
    },
  },
];
