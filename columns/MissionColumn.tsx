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
      <DataTableColumnHeader column={column} title="Branch" className="justify-center" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <span>{user.branch.title}</span>;
    },
  },
  {
    accessorKey: "missionDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" className="justify-center" />
    ),
    cell: ({ row }) => {

      const formattedDate = format(new Date(row.original.missionDate), "yyyy-MM-dd hh:mm:ss ");
      return <span className="text-[10px] min-w-[120px] flex justify-center">{formattedDate}</span>;
    }
  },
  {
    accessorKey: "staffName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" className="justify-center" />
    ),
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" className="justify-center" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <span className="flex justify-end text-right">{formatCurrency(amount)}</span>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" className="uppercase justify-center flex " />
    ),
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
        <div className="flex items-center space-x-1 pl-7">
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
