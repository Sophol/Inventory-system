"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { deleteCategory } from "@/lib/actions/category.action";
import { toast } from "@/hooks/use-toast";
import ButtonDelete from "@/components/formInputs/ButtonDelete";

export type Category = {
  _id: string;
  title: string;
  status: string;
};

export const CategoryColumn: ColumnDef<Category>[] = [
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
      const category = row.original;
      const handleDelete = async () => {
        // Add your delete logic here
        const { success, error } = await deleteCategory({
          categoryId: category._id,
        });
        if (success) {
          toast({
            title: "success",
            description: "Category deleted successfully.",
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
            href={ROUTES.CATEGORY(category._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
