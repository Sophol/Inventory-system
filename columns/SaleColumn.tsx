"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import { deleteSale } from "@/lib/actions/sale.action";
import { toast } from "@/hooks/use-toast";

export type Sale = {
  _id: string;
  referenceNo: string;
  supplier: { _id: string; name: string };
  branch: { _id: string; title: string };
  saleDate: string;
  orderStatus: string;
  paymentStatus: string;
};

const reloadPage = () => {
  window.location.reload();
};

export const SaleColumn: ColumnDef<Sale, SaleTableMeta>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference No" />
    ),
  },
  {
    accessorKey: "supplier.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
  },
  {
    accessorKey: "branch.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
  },
  {
    accessorKey: "saleDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sale Date" />
    ),
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return (
        <Badge
          className={status === "completed" ? "bg-green-500" : "bg-yellow-500"}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          className={status === "completed" ? "bg-green-500" : "bg-red-500"}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const sale = row.original;

      const handleDelete = async () => {
        // Add your delete logic here
        const { success } = await deleteSale({ saleId: sale._id });
        if (success) {
          toast({
            title: "success",
            description: "Sale deleted successfully.",
          });
          // Provide an alternative way to refresh the table data
          reloadPage();
        } else {
          toast({
            title: "error",
            description: "Something went wrong.",
            variant: "destructive",
          });
        }
      };
      return (
        <div className="flex items-center space-x-1">
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.SALE(sale._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
