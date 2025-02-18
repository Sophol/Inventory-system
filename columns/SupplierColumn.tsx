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
      <DataTableColumnHeader column={column} title="Status" className="flex justify-center whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "active" ? "bg-green-500 flex justify-center text-[9px] pt-1 mx-auto uppercase h-[21px] min-w-[85px] w-[85px]" : "bg-red-500 text-[9px] uppercase flex justify-center pt-1 mx-auto h-[21px] min-w-[85px] w-[85px] "}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" className="flex justify-center whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const companyName = row.getValue("companyName") as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex ">{companyName}</span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="flex justify-center whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex ">{name}</span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" className="flex justify-center whitespace-nowrap"/>
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex ">{phone}</span>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" className="flex justify-center whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex ">{location}</span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" className="flex justify-center uppercase whitespace-nowrap" />
    ),
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
        <div className="flex items-center space-x-1 justify-center">
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
