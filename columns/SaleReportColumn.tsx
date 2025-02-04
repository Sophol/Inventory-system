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
      <DataTableColumnHeader column={column} title="Reference No" />
    ),
  },
  {
    accessorKey: "invoicedDate", // Assuming saleDate is the date field you want to format
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("invoicedDate") as string;
      const formattedDate = format(new Date(date), "dd/MM/yyyy hh:mm:ss "); // Customize format as needed
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "branch.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
  },
  {
     accessorKey: "grandtotal",
     header: ({ column }) => (
       <DataTableColumnHeader column={column} title="Grand Total" />
     ),
     cell: ({ row }) => {
       const grandtotal = row.getValue("grandtotal") as number;
       return <span>{formatCurrency(grandtotal)}</span>;
     },
   },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => {
      const discount = row.getValue("discount") as number;
      return <span>{formatCurrency(discount)}</span>;
    },
  },
  {
    accessorKey: "delivery",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery" />
    ),
    cell: ({ row }) => {
      const delivery = row.getValue("delivery") as number;
      return <span>{formatCurrency(delivery)}</span>;
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      const paid = row.getValue("paid") as number;
      return <span>{formatCurrency(paid)}</span>;
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number;
      return <span>{formatCurrency(balance)}</span>;
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-500 uppercase"
              : status === "approved"
                ? "bg-blue-500 uppercase"
                : status === "pending"
                  ? "bg-yellow-500 uppercase"
                  : "bg-red-500 uppercase"
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
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-500 uppercase"
              : status === "approved"
                ? "bg-blue-500 uppercase"
                : status === "pending"
                  ? "bg-yellow-500 uppercase"
                  : "bg-red-500 uppercase"
          }
        >
          {status}
        </Badge>
      );
    },
  },
];
