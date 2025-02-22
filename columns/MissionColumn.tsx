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
import { formatCurrency } from "@/lib/utils";
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
      <DataTableColumnHeader
        column={column}
        title="Branch"
        className="justify-center  whitespace-nowrap"
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
    accessorKey: "missionDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Date"
        className="justify-center  whitespace-nowrap"
      />
    ),
    cell: ({ row }) => {
      const formattedDate = format(
        new Date(row.original.missionDate),
        "yyyy-MM-dd hh:mm:ss "
      );
      return (
        <span className="text-[10px]  whitespace-nowrap flex justify-center">
          {formattedDate}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Title"
        className="justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const mission = row.original;
      return (
        <span className="text-[9px] whitespace-nowrap ">
          {mission.staffName}
        </span>
      );
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Amount"
        className="justify-center whitespace-nowrap "
      />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <span className="flex justify-end text-right  whitespace-nowrap px-4">
          {formatCurrency(amount)}
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
        className="uppercase justify-center flex  whitespace-nowrap "
      />
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
        <div className="justify-center flex  whitespace-nowrap items-center">
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
