"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const ProductQRColumn: ColumnDef<ProductQR>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex justify-center whitespace-nowrap ">
          <Badge
            className={`${status === "1" ? "bg-green-500  text-[10px]" : "bg-red-500  text-[10px]"} uppercase`}
          >
            {status === "1" ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "product_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      const code = row.getValue("product_code") as string;
      return (
        <div className="flex justify-center whitespace-nowrap ">
          <span className="flex justify-center whitespace-nowrap px-4">
            {code}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("product_name") as string;
      return <span className="flex whitespace-nowrap px-4">{title}</span>;
    },
  },
  {
    accessorKey: "raw_serial",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Raw Serial" />
    ),
    cell: ({ row }) => {
      const serial = row.getValue("raw_serial") as string;
      return <span className="flex whitespace-nowrap px-4">{serial}</span>;
    },
  },
  {
    accessorKey: "encrypt_serial",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Encrypt Serial" />
    ),
    cell: ({ row }) => {
      const serial = row.getValue("encrypt_serial") as string;
      return <span className="flex whitespace-nowrap px-4">{serial}</span>;
    },
  },
  {
    accessorKey: "generated_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Generated Year" />
    ),
    cell: ({ row }) => {
      const year = row.getValue("generated_year") as number;
      return <span className="flex whitespace-nowrap px-4">{year}</span>;
    },
  },
  {
    accessorKey: "viewer_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Viewer Count" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("viewer_count") as number;
      return <span className="flex whitespace-nowrap px-4">{count}</span>;
    },
  },
  {
    accessorKey: "expired_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expired Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("expired_date") as Date | null;
      return (
        <span className="flex whitespace-nowrap px-4">
          {date ? date.toLocaleDateString() : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
    cell: ({ row }) => {
      const remarks = row.getValue("remarks") as string | null;
      return (
        <span className="flex whitespace-nowrap px-4">{remarks || "N/A"}</span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Action"
        className="flex justify-center  whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center space-x-1 justify-center  whitespace-nowrap">
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.PRODUCT(product._id)}
            isIcon
            className="text-primary-500"
          />
        </div>
      );
    },
  },
];
