"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  location: string;
  socialLink?: string;
  status: string;
};

export const CustomerColumn: ColumnDef<Customer>[] = [
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
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
  },
  {
    accessorKey: "socialLink",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SocialLink" />
    ),
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
