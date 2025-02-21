"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaEye, FaRegEdit, FaRegFileArchive } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { formatCurrency } from "@/lib/utils";
import { deleteCustomer } from "@/lib/actions/customer.action";
import { toast } from "@/hooks/use-toast";
import ButtonDelete from "@/components/formInputs/ButtonDelete";

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  location: string;
  balance?: string | number;
  status: string;
  isDepo: boolean;
};

export const CustomerColumn: ColumnDef<Customer>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="flex justify-center whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "active"
              ? "bg-green-500 text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto uppercase"
              : "uppercase bg-red-500 text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
        className="flex justify-center whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <span className="flex justify-center whitespace-nowrap ">{name}</span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Phone"
        className="flex justify-center whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return (
        <span className="flex justify-center whitespace-nowrap">{phone}</span>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Location"
        className="flex justify-center whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return (
        <span className="flex justify-center whitespace-nowrap">{location}</span>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Balance"
        className="flex justify-center whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      const customer = row.original;
      const balance =
        typeof customer.balance === "number"
          ? customer.balance
          : parseFloat(customer.balance ?? "0") || 0;
      return (
        <span className="flex justify-end whitespace-nowrap" suppressHydrationWarning>
          {formatCurrency(balance)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Action"
        className="flex justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const customer = row.original;
      const hrefLink = `${ROUTES.INVOICES}?customerId=${customer._id}&filter=balance`;
      const handleDelete = async () => {
        // Add your delete logic here
        const { success, error } = await deleteCustomer({
          customerId: customer._id,
        });
        if (success) {
          toast({
            title: "success",
            description: "Customer deleted successfully.",
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
        <div className="flex items-center space-x-1  justify-center">
          <RedirectButton
            Icon={FaEye}
            href={hrefLink}
            isIcon
            className="text-blue-500"
          />
          {customer.isDepo && (
            <RedirectButton
              Icon={FaRegFileArchive}
              href={
                ROUTES.CUSTOMERCONTRACT(customer._id) +
                `?customerId=${customer._id}`
              }
              isIcon
              className="text-blue-500"
            />
          )}
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.CUSTOMER(customer._id)}
            isIcon
            className="text-primary-500"
          />

          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
