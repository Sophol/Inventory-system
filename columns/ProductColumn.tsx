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
        <div className="flex justify-center whitespace-nowrap ">
        <Badge className={`${status === "active" ? "bg-green-500  text-[10px]" : "bg-red-500  text-[10px]" } uppercase`}>
          {status}
        </Badge>
      </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return (
        <div className="flex justify-center whitespace-nowrap ">
          <span className="flex justify-center whitespace-nowrap px-4">{code}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
      
        <span className="flex justify-center whitespace-nowrap px-4">{ category.categoryTitle}</span>

      )
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-4">{title}</span>
      );
    },
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
      return (
        <span className="flex justify-center whitespace-nowrap px-4">{qty}</span>
      );
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
      return (
        <span className="flex justify-center whitespace-nowrap px-4">{qty}</span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action"  className="flex justify-center  whitespace-nowrap" />
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
        <div className="flex items-center space-x-1 justify-center  whitespace-nowrap">
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
