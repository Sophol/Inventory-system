"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { format } from "date-fns";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import { toast } from "@/hooks/use-toast";
import { deleteMission } from "@/lib/actions/mission.action";
import { formatCurrency } from '@/lib/utils';
export interface Mission {
  _id: string;
  missionDate: Date;
  staffName: string;
  branch: { _id: string; title: string };
  amount: number;
  exchangeRateD: number;
  exchangeRateT: number;
  description: string;
}

export const MissionColumn: ColumnDef<Mission>[] = [
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
    accessorKey: "missionDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.missionDate), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    accessorKey: "staffName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <span>{formatCurrency(amount)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const mission = row.original;

      const handleDelete = async () => {
        const { success } = await deleteMission({ missionId: mission._id });
        if (success) {
          toast({
            title: "Success",
            description: "Mission deleted successfully.",
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
            href={ROUTES.MISSIONEXP(mission._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
