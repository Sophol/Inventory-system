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
      <DataTableColumnHeader column={column} title="Status" className="flex justify-center whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "active" ? "uppercase bg-green-500  text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto" : "bg-red-500  text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto uppercase"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code"  className="flex justify-center  whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-1">{code}</span>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category"  className="flex justify-center  whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <span className=" whitespace-nowrap px-1">{category.categoryTitle}</span>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title"  className="flex justify-center" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <span className=" px-1 whitespace-nowrap ">{title}</span>
      );
    },
  },
  {
    accessorKey: "qtyOnHand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QtyOnHand"  className="flex justify-center" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const qty = convertFromSmallUnitQty(
        product.qtySmallUnit ?? 0,
        product.units
      );
      return (
        <span className="flex justify-center whitespace-nowrap ">{qty}</span>
      );
    },
  },
  {
    accessorKey: "alertQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AlertQty"  className="flex justify-center"  />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const qty = convertFromSmallUnitQty(product.alertQty ?? 0, product.units);
      return (
        <span className="flex justify-center whitespace-nowrap ">{qty}</span>
      );
    },
  },
];
