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
      <DataTableColumnHeader
        column={column}
        title="Reference No"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => {
      const referenceNo = row.getValue("referenceNo") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-4">
          {referenceNo}
        </span>
      );
    },
  },
  {
    accessorKey: "supplier.name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Supplier"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => {
      const supplier = row.original.supplier?.title as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex ">
          {supplier}
        </span>
      );
    },
  },
  {
    accessorKey: "branch.title",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Branch"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => {
      const branch = row.original.branch.title as string;
      return (
        <span className="text-[9px] whitespace-nowrap flex justify-center ">
          {branch}
        </span>
      );
    },
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Purchase Date"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue("purchaseDate") as Date;
      return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Order Status"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-500  uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
              : "bg-yellow-500  uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center mx-auto"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Payment Status"
        className="flex justify-center"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-500  uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center mx-auto"
              : "bg-red-500  uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center mx-auto"
          }
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
      return (
        <span className="flex justify-end">{formatCurrency(grandtotal)}</span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="flex justify-center"
      />
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
        <div className="flex items-center space-x-1 justify-center">
          <RedirectButton
            title="Approve"
            href={ROUTES.APPROVEDPURCHASE(purchase._id)}
            className="bg-green-500 text-white uppercase text-[9px] h-[21px] min-h-[21px]  min-w-[85px] w-[85px] flex justify-center mx-auto"
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
