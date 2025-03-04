"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit, FaFileInvoice } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import ButtonApproveOrder from "@/components/formInputs/ButtonApproveOrder";

import { deleteSale, updateOrderStatus } from "@/lib/actions/sale.action";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/actions/user.action";
import { formatCurrency } from "@/lib/utils";

const reloadPage = () => {
  window.location.reload();
};

export const SaleColumn: ColumnDef<Sale>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Reference No"
        className=" whitespace-nowrap justify-center flex"
      />
    ),
    cell: ({ row }) => {
      const referenceNo = row.getValue("referenceNo") as string;
      return <span className="text-[10px] whitespace-nowrap justify-center flex">{referenceNo}</span>;
    },
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Customer"
        className=" whitespace-nowrap justify-center flex"
      />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer.title as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex">{customer}</span>
      );
    },
  },
  {
    accessorKey: "branch.title",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Branch"
        className="justify-center flex flex-nowrap"
      />
    ),
    cell: ({ row }) => {
      const branch = row.original.branch.title as string;
      return (
        <span className="text-[9px] whitespace-nowrap flex justify-center ">{branch}</span>
      );
    },
  },
  {
    accessorKey: "subtotal",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sub Total"
        className="whitespace-nowrap justify-center flex"
      />
    ),
    cell: ({ row }) => {
      const subtotal = row.getValue("subtotal") as number;
      return (
        <span className="flex justify-end whitespace-nowrap px-4">{formatCurrency(subtotal)}</span>
      );
    },
  },
  {
    accessorKey: "grandtotal",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Grand Total"
        className="whitespace-nowrap justify-center flex"
      />
    ),
    cell: ({ row }) => {
      const grandtotal = row.getValue("grandtotal") as number;
      return (
        <span className="flex justify-end whitespace-nowrap px-4">{formatCurrency(grandtotal)}</span>
      );
    },
  },
  {
    accessorKey: "orderDate", // Assuming saleDate is the date field you want to format
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Order Date"
        className="whitespace-nowrap justify-center flex"
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue("orderDate") as string;
      const formattedDate = format(new Date(date), "yyy-mm-d hh:mm:ss "); // Customize format as needed
      return (
        <span className="text-[10px] whitespace-nowrap justify-center flex">
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
        className="whitespace-nowrap justify-center flex"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
              : status === "approved"
                ? "bg-blue-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
                : status === "pending"
                  ? "bg-yellow-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
                  : "bg-red-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="justify-center  flex"
      />
    ),
    cell: ({ row }) => {
      const sale = row.original;
      const [userRole, setUserRole] = useState<string | null>(null);

      useEffect(() => {
        const fetchUserRole = async () => {
          const role = await getUserRole();
          setUserRole(role ?? null);
        };

        fetchUserRole();
      }, []);
      const handleApproveOrder = async () => {
        const { success } = await updateOrderStatus({
          saleId: sale._id,
          isLogo: sale.isLogo,
        });
        if (success) {
          toast({
            title: "success",
            description: "Order Status update successfully.",
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
      const handleDelete = async () => {
        const { success } = await deleteSale({ saleId: sale._id });
        if (success) {
          toast({
            title: "success",
            description: "Sale deleted successfully.",
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
          <div>
            {sale.orderStatus === "pending" ? (
              // Display the "above" content
              <ButtonApproveOrder onPopup={handleApproveOrder} />
            ) : (
              // Display the "below" content
              <RedirectButton
                title="Invoice"
                href={ROUTES.APPROVEDINVOICE(sale._id)}
                className="bg-green-500 text-white"
                Icon={FaFileInvoice}
              />
            )}
          </div>
          {userRole === "admin" && (
            <>
              <RedirectButton
                Icon={FaRegEdit}
                href={ROUTES.APPROVEDSALE(sale._id)}
                isIcon
                className="text-primary-500"
              />
              <ButtonDelete onDelete={handleDelete} />
            </>
          )}
        </div>
      );
    },
  },
];
