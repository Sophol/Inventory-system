import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ButtonPopupProps {
  onPopup: (isLogo: string) => void;
}

const ButtonPopup: React.FC<ButtonPopupProps> = ({ onPopup }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePopup = (isLogo: string) => {
    onPopup(isLogo)
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-green-500"
        onClick={() => setIsDialogOpen(true)}
      >
          <FaRegCheckCircle />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="hidden">
            <FaRegCheckCircle />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Approve</DialogTitle>
          <DialogDescription>
            Are you sure you want to Approve this Order?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={() => handlePopup("true") }>
              Approve With Logo  <FaRegCheckCircle />
            </Button>
            <Button variant="info" onClick={() => handlePopup("false")}>
              Approve No Logo  <FaRegCheckCircle />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ButtonPopup;
