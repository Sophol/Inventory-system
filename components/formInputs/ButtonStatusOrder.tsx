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
  onPopup: () => void;
  disable: boolean;
  classValue:string;
  btnTitle:string
  description: string;
}

const ButtonPopup: React.FC<ButtonPopupProps> = ({ onPopup, disable, classValue, btnTitle, description }) => {
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
        disabled={disable}
        className={classValue}
        onClick={() => setIsDialogOpen(true)}
      >
            <FaRegCheckCircle /> {btnTitle}
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="hidden">
            <FaRegCheckCircle />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handlePopup}>
              Approve   <FaRegCheckCircle />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ButtonPopup;
