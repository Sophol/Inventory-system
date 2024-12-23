"use client";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { FaRegEdit } from "react-icons/fa";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  _id: string;
  title: string;
  status: string;
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <RedirectButton
          Icon={FaRegEdit}
          href={ROUTES.CATEGORY(category._id)}
          isIcon
          className="text-primary-500"
        />
      );
    },
  },
];
