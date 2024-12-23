"use client";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { FaRegEdit } from "react-icons/fa";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Category = {
  _id: string;
  title: string;
  name: string;
};

export const CategoryColumn: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        
          {name}
        
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "social_link",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Social link" />
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "saleType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sale Type" />
    ),
    cell: ({ row }) => {
      const saleType = row.getValue("saleType") as string;
      return (
        <Badge className={saleType === "retail" ? "bg-green-300" : "bg-amber-500"}>
          {saleType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
  },
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
