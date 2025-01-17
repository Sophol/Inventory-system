"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { format } from "date-fns";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import { toast } from "@/hooks/use-toast";
import { deleteGeneralExp } from "@/lib/actions/generalExp.action";

export interface GeneralExp {
  _id: string;
  generalDate: Date;
  title: string;
  branch: { _id: string; title: string };
  amount: number;
  exchangeRateD: number;
  exchangeRateT: number;
  description: string;
}

export const GeneralExpColumn: ColumnDef<GeneralExp>[] = [
  {
    accessorKey: "generalDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.generalDate), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <span>{user.branch.title}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "exchangeRateD",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Exchange Rate Dollar" />
    ),
  },
  {
    accessorKey: "exchangeRateT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Exchange Rate Thai" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const generalExp = row.original;

      const handleDelete = async () => {
        const { success } = await deleteGeneralExp({
          generalExpId: generalExp._id,
        });
        if (success) {
          toast({
            title: "Success",
            description: "General expense deleted successfully.",
          });
          window.location.reload();
        } else {
          toast({
            title: "Error",
            description: "Something went wrong.",
            variant: "destructive",
          });
        }
      };
      return (
        <div className="flex items-center space-x-1">
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.GENERALEXP(generalExp._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
