import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ButtonDeleteProps {
  onDelete: () => void;
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500"
        onClick={() => setIsDialogOpen(true)}
      >
        <FaTrashAlt />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="hidden">
            <FaTrashAlt />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this purchase?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ButtonDelete;
