"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { deleteSupplier } from "@/lib/actions/supplier.action";
import { toast } from "@/hooks/use-toast";
import ButtonDelete from "@/components/formInputs/ButtonDelete";

export interface Supplier {
  _id: string;
  companyName: string;
  name: string;
  phone: string;
  location: string;
  status: "active" | "inactive";
}

export const SupplierColumn: ColumnDef<Supplier>[] = [
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
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
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
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;
      const handleDelete = async () => {
        // Add your delete logic here
        const { success, error } = await deleteSupplier({
          supplierId: supplier._id,
        });
        if (success) {
          toast({
            title: "success",
            description: "Supplier deleted successfully.",
          });
          window.location.reload();
        } else {
          toast({
            title: "error",
            description: error?.message || "Something went wrong.",
            variant: "destructive",
          });
        }
      };
      return (
        <div className="flex items-center space-x-1">
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.SUPPLIER(supplier._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
