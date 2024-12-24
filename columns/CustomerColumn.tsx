"use client";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { FaRegEdit } from "react-icons/fa";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  social_link: string;
  location: string;
  description: string;
  saleType: "retail" | "wholesale";
  balance: number;
  status: "active" | "inactive";
};

export const CustomerColumn: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
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
        <Badge className={`${saleType === "retail" ? "bg-blue-700" : "bg-amber-500"} uppercase`}>
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
      const customer = row.original;
      return (
        <RedirectButton
          Icon={FaRegEdit}
          href={ROUTES.CUSTOMER(customer._id)}
          isIcon
          className="text-primary-500"
        />
      );
    },
  },
];
