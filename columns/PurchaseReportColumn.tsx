"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { format } from "date-fns";
import RedirectButton from "@/components/formInputs/RedirectButton";
import ROUTES from "@/constants/routes";
import { deletePurchaseApproved } from "@/lib/actions/purchase.action";
import { toast } from "@/hooks/use-toast";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import { formatCurrency } from "@/lib/utils";

export const PurchaseReportColumn: ColumnDef<Purchase>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Reference No"
        className="flex justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const referenceNo = row.getValue("referenceNo") as string;
      return (
        <span className=" text-[9px] flex justify-center  whitespace-nowrap ">
          {referenceNo}
        </span>
      );
    },
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Supplier"
        className="flex justify-center whitespace-nowrap "
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
        className="flex justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const branch = row.original.branch?.title as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex ">
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
        className="flex justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue("purchaseDate") as string;
      const formattedDate = format(new Date(date), "dd/MM/yyyy hh:mm:ss "); // Customize format as needed
      return (
        <span className="text-[9px] flex justify-center whitespace-nowrap ">
          {formattedDate}
        </span>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Order Status"
        className="flex justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "uppercase bg-green-500 text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
              : "bg-yellow-500 text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto uppercase"
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
        className="flex justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "uppercase bg-green-500 text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
              : "bg-red-500 text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto uppercase"
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
      <DataTableColumnHeader
        column={column}
        title="Grand Total"
        className="flex justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const grandtotal = row.getValue("grandtotal") as number;
      return (
        <span className="justify-end flex whitespace-nowrap px-4 ">
          {formatCurrency(grandtotal)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="flex justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const purchase = row.original;
      const handleDelete = async () => {
        // Add your delete logic here
        const { success } = await deletePurchaseApproved({
          purchaseId: purchase._id,
        });
        if (success) {
          toast({
            title: "success",
            description: "Purchase deleted successfully.",
          });
          window.location.reload();
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
            title="Preview"
            href={ROUTES.PREVIEWPURCHASE(purchase._id)}
            className="bg-green-500 text-white uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center mx-auto"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
