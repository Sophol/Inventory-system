import React, { useState, useEffect, useRef } from "react";
import { FaDollarSign, FaRegArrowAltCircleLeft } from "react-icons/fa";
import PaymentForm from "../forms/PaymentForm";
import { getPayment } from "@/lib/actions/payment.action";
import { Button } from "../ui/button";

interface PaymentDrawerProps {
  sale: Sale;
}

const PaymentDrawer: React.FC<PaymentDrawerProps> = ({ sale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [payment, setPayment] = useState<any>(null); // Adjust the type as needed
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      const { data: payment, success } = await getPayment({ saleId: sale._id });
      setPayment(success ? payment : null);
    };

    if (isOpen) {
      fetchPayment();
    }
  }, [isOpen, sale._id]);

  useEffect(() => {
    // Update the button's disabled state based on payment status
    setIsButtonDisabled(
      payment?.paymentStatus === "completed" ||
        sale?.paymentStatus === "completed" ||
        sale?.paid === sale?.balance
    );
  }, [sale, payment]);

  const handleToggleDrawer = () => {
    if (!isButtonDisabled) {
      setIsOpen(!isOpen); // Toggle the drawer open/close
    }
  };

  // const handlePaymentUpdate = (updatedPayment: any) => {
  //   setPayment(updatedPayment);
  //   onClose(updatedPayment);
  //   // Recalculate the button's disabled state
  //   setIsButtonDisabled(
  //     updatedPayment?.paymentStatus === "completed" ||
  //       sale?.paymentStatus === "completed" ||
  //       sale?.paid === sale?.balance
  //   );
  // };

  return (
    <>
      {/* Button to open the drawer */}
      <Button
        disabled={isButtonDisabled}
        type="button"
        onClick={handleToggleDrawer}
        className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        <FaDollarSign /> Add Payment
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleToggleDrawer}
        ></div>
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full bg-light-900 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-4/5 md:w-1/4 z-50`}
      >
        <div className="drawer-header flex justify-between items-center p-6">
          <h1 className="text-xl ">Add Payment</h1>
          <FaRegArrowAltCircleLeft
            className="cursor-pointer text-xl"
            onClick={handleToggleDrawer}
          />
        </div>
        <hr className="border-t border-gray-300" />
        <PaymentForm
          sale={sale}
          payment={payment}
          onClose={handleToggleDrawer}
        />
      </div>
    </>
  );
};

export default PaymentDrawer;
