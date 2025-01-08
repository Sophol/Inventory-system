import React, { useState, useRef } from "react";
import { FaDollarSign, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import PaymentForm from "../forms/PaymentForm";
import { getPayment } from "@/lib/actions/payment.action";


const PaymentDrawer = ({ sale }: { sale: Sale }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [payment, setPayment] = useState<Payment>({} as Payment); // Initialize payment state with an empty object
  const drawerRef = useRef<HTMLDivElement>(null);

  const toggleDrawer = async () => {
    if (!isOpen) { 
       // Fetch payment data
       const { data: paymentData, success } = await getPayment({ saleId: sale._id });
      // If the payment data fetch is successful, update the state
    if (success && paymentData) {
      setPayment(paymentData);
    }}
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Button to open the drawer */}
      <Button
        type="submit"
        onClick={toggleDrawer}
        className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        <FaDollarSign /> Add Payment
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer}
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
            onClick={toggleDrawer}
          />
        </div>
        <hr className="border-t border-gray-300" />
        <PaymentForm sale={sale} payment={payment} />
      </div>
    </>
  );
};

export default PaymentDrawer;
