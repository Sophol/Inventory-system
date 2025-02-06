"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { convertFromSmallUnitQty } from "@/lib/utils";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import { deleteProduct } from "@/lib/actions/product.action";
import { toast } from "@/hooks/use-toast";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const ProductColumn: ColumnDef<Product>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "active" ? "bg-green-500  text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto" : "bg-red-500  text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"}>
          {status} 1
        </Badge>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return category.categoryTitle;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "qtyOnHand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QtyOnHand" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const qty = convertFromSmallUnitQty(
        product.qtySmallUnit ?? 0,
        product.units
      );
      return qty;
    },
  },
  {
    accessorKey: "alertQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AlertQty" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const qty = convertFromSmallUnitQty(product.alertQty ?? 0, product.units);
      return qty;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const handleDelete = async () => {
        // Add your delete logic here
        const { success, error } = await deleteProduct({
          productId: product._id,
        });
        if (success) {
          toast({
            title: "success",
            description: "Product deleted successfully.",
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
            href={ROUTES.PRODUCT(product._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
