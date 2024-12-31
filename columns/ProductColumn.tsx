"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { convertFromSmallUnitQty } from "@/lib/utils";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  _id: string;
  title: string;
  categoryTitle: string;
  status: string;
  qtySmallUnit: number;
  units: ProductUnit[];
};

export const ProductColumn: ColumnDef<Product>[] = [
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
      const qty = convertFromSmallUnitQty(product.qtySmallUnit, product.units);
      return qty;
    },
  },
  {
    accessorKey: "alertQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AlertQty" />
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <RedirectButton
          Icon={FaRegEdit}
          href={ROUTES.PRODUCT(product._id)}
          isIcon
          className="text-primary-500"
        />
      );
    },
  },
];
