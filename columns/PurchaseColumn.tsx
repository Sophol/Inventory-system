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
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
const reloadPage = () => {
  window.location.reload();
};

export const PurchaseColumn: ColumnDef<Purchase>[] = [
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
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Depo" />
    ),
    cell: ({ row }) => {
      const purchase = row.original;
      return purchase.customer ? purchase.customer.title : "";
    },
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("purchaseDate") as Date;
      return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
    },
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
    accessorKey: "grandtotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grand Total" />
    ),
    cell: ({ row }) => {
      const grandtotal = row.getValue("grandtotal") as number;
      return <span>{formatCurrency(grandtotal)}</span>;
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
            title="Approve"
            href={ROUTES.APPROVEDPURCHASE(purchase._id)}
            className="bg-green-500 text-white"
          />
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
