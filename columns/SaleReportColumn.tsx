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
      <DataTableColumnHeader column={column} title="Reference No" className="flex justify-center" />
    ),
  },
  {
    accessorKey: "invoicedDate", // Assuming saleDate is the date field you want to format
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" className="flex justify-center"/>
    ),
    cell: ({ row }) => {
      const date = row.getValue("invoicedDate") as string;
      const formattedDate = format(new Date(date), "dd/MM/yyyy hh:mm:ss "); // Customize format as needed
      return <span className="text-[9px] min-w-[105px] flex justify-center">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" className="flex justify-center"/>
    ),
  },
  {
    accessorKey: "branch.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" className="flex justify-center"/>
    ),
    cell: ({ row }) => {
      const branch = row.original.branch.title as string;
      return <span className="text-[9px] min-w-[100px] inline-flex">{branch}</span>;
    },
  },
  {
     accessorKey: "grandtotal",
     header: ({ column }) => (
       <DataTableColumnHeader column={column} title="Grand Total" className="flex justify-center"/>
     ),
     cell: ({ row }) => {
       const grandtotal = row.getValue("grandtotal") as number;
       return <span className="flex justify-end  min-w-[90px] inline-flex">{formatCurrency(grandtotal)}</span>;
     },
   },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" className="flex justify-center"/>
    ),
    cell: ({ row }) => {
      const discount = row.getValue("discount") as number;
      return <span className="flex justify-end ">{formatCurrency(discount)}</span>;
    },
  },
  {
    accessorKey: "delivery",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery" className="flex justify-center"/>
    ),
    cell: ({ row }) => {
      const delivery = row.getValue("delivery") as number;
      return <span  className="flex justify-end">{formatCurrency(delivery)}</span>;
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" className="flex justify-center"/>
    ),
    cell: ({ row }) => {
      const paid = row.getValue("paid") as number;
      return <span className="flex justify-end  min-w-[90px] inline-flex">{formatCurrency(paid)}</span>;
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" className="flex justify-center" />
    ),
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number;
      return <span className="flex justify-end  min-w-[90px] inline-flex">{formatCurrency(balance)}</span>;
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" className="flex justify-center"/>
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
