"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { deleteBranch } from "@/lib/actions/branch.action";
import { toast } from "@/hooks/use-toast";
import ButtonDelete from "@/components/formInputs/ButtonDelete";

export interface Branch {
  _id: string;
  title: string;
  phone: string;
  location: string;
  description?: string;
  status: "active" | "inactive";
}

export const BranchColumn: ColumnDef<Branch>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="status" className="whitespace-nowrap "/>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex justify-center whitespace-nowrap ">
        <Badge className={`${status === "active" ? "bg-green-500  text-[10px]" : "bg-red-500  text-[10px]" } uppercase`}>
          {status}
        </Badge>
      </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="title" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className=" text-[9px] flex justify-center  whitespace-nowrap ">{title}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="phone" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return <span className=" text-[9px] flex justify-center  whitespace-nowrap ">{phone}</span>;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="location" />
    ),
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return <span className=" text-[9px] flex justify-center  whitespace-nowrap ">{location}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      const handleDelete = async () => {
        // Add your delete logic here
        const { success, error } = await deleteBranch({
          branchId: branch._id,
        });
        if (success) {
          toast({
            title: "success",
            description: "Branch deleted successfully.",
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
            href={ROUTES.BRANCH(branch._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
