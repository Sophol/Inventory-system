"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import { deletePurchase } from "@/lib/actions/purchase.action";
import { toast } from "@/hooks/use-toast";

export type Purchase = {
  _id: string;
  referenceNo: string;
  supplier: { _id: string; name: string };
  branch: { _id: string; title: string };
  purchaseDate: string;
  orderStatus: string;
  paymentStatus: string;
};

const reloadPage = () => {
  window.location.reload();
};

export const PurchaseColumn: ColumnDef<Purchase, PurchaseTableMeta>[] = [
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
    accessorKey: "purchaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Date" />
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
      const purchase = row.original;

      const handleDelete = async () => {
        // Add your delete logic here
        const { success } = await deletePurchase({ purchaseId: purchase._id });
        if (success) {
          toast({
            title: "success",
            description: "Purchase deleted successfully.",
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
            href={ROUTES.PURCHASE(purchase._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
