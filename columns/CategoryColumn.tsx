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
      <DataTableColumnHeader column={column} title="Status"         className="flex justify-center whitespace-nowrap"/>
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
      <DataTableColumnHeader
        column={column}
        title="Title"
        className="flex justify-center whitespace-nowrap"
      />
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
        <div className="flex items-center space-x-1 justify-center whitespace-nowrap">
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
