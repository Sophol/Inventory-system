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
        <div className="flex items-center space-x-1">
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
