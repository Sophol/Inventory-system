"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Category = {
  id: string;
  title: string;
  status: string;
};

export const CategoryColumn: ColumnDef<Category>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
];
