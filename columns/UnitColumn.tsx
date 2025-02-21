"use client";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { FaRegEdit } from "react-icons/fa";
import { deleteUnit } from "@/lib/actions/unit.action";
import { toast } from "@/hooks/use-toast";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
export type Unit = {
  _id: string;
  title: string;
  status: string;
};

export const UnitColumn: ColumnDef<Unit>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status"  className="whitespace-nowrap"/>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex justify-center ">
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
      <DataTableColumnHeader column={column} title="Title" className="whitespace-nowrap"/>
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-4">{title}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const unit = row.original;
      const handleDelete = async () => {
        // Add your delete logic here
        const { success, error } = await deleteUnit({
          unitId: unit._id,
        });
        if (success) {
          toast({
            title: "success",
            description: "Unit deleted successfully.",
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
        <div className="flex items-center space-x-1  justify-center whitespace-nowrap">
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.UNIT(unit._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
