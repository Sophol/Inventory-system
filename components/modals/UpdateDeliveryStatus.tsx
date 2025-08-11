// /components/modals/UpdateDeliveryStatus.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { updateSaleDeliveryStatus } from "@/lib/actions/invoice.action";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the shape of the sale prop
interface UpdateDeliveryStatusProps {
  sale: Sale; // Assuming 'Sale' is your globally defined type
}

const getBadgeClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-500 hover:bg-green-600";
    case "shipped":
      return "bg-blue-500 hover:bg-blue-600";
    case "canceled":
      return "bg-red-500 hover:bg-red-600";
    case "pending":
    default:
      return "bg-yellow-500 hover:bg-yellow-600";
  }
};

const UpdateDeliveryStatus = ({ sale }: UpdateDeliveryStatusProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"pending" | "delivered" | "canceled">(
    (sale.deliveryStatus as "pending" | "delivered" | "canceled") || "pending"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await updateSaleDeliveryStatus({
      saleId: sale._id,
      status: status,
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Delivery status has been updated.",
      });
      setIsOpen(false); // Close the dialog
      router.refresh(); // Refresh data without full page reload
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not update status.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Badge
          className={`cursor-pointer uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto text-white ${getBadgeClass(
            sale.deliveryStatus || "pending"
          )}`}
        >
          {sale.deliveryStatus || "N/A"}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Delivery Status</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Ref No: {sale.referenceNo}
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            onValueChange={(value) =>
              setStatus(value as "pending" | "delivered" | "canceled")
            }
            defaultValue={status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="primary-gradient text-light-900"
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDeliveryStatus;
