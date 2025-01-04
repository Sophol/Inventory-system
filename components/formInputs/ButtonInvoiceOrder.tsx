import { useState } from "react";
import { FaPrint } from "react-icons/fa";

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
  onPopup: () => void;
}

const ButtonPopup: React.FC<ButtonPopupProps> = ({ onPopup }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePopup = () => {
    onPopup();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-blue-500"
        onClick={() => setIsDialogOpen(true)}
      >
             <FaPrint />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="hidden">
            <FaPrint />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Issue</DialogTitle>
          <DialogDescription>
            Are you sure you want to Issue this Invoice?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="info" onClick={handlePopup}>
              Issue <FaPrint />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ButtonPopup;
