"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { convertFromSmallUnitQty } from "@/lib/utils";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const ProductReportColumn: ColumnDef<Product>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "active" ? "bg-green-500" : "bg-red-500"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return category.categoryTitle;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "qtyOnHand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QtyOnHand" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const qty = convertFromSmallUnitQty(
        product.qtySmallUnit ?? 0,
        product.units
      );
      return qty;
    },
  },
  {
    accessorKey: "alertQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AlertQty" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const qty = convertFromSmallUnitQty(product.alertQty ?? 0, product.units);
      return qty;
    },
  },
];
