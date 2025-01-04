import React, { useState, useEffect, useRef } from 'react';
import { FaDollarSign, FaRegArrowAltCircleLeft } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PaymentForm from '../forms/PaymentForm';
interface PaymentDrawerProps {
    sale: any; 
}

const PaymentDrawer: React.FC<PaymentDrawerProps> = ({ sale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Button to open the drawer */}
          <Button type="submit"
          onClick={toggleDrawer}
            className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
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
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-4/5 md:w-1/4 z-50`}
      >
        <div className="drawer-header flex justify-between items-center p-6">
        <h1 className="text-xl ">Add Payment</h1>
        <FaRegArrowAltCircleLeft className="cursor-pointer text-xl" onClick={toggleDrawer} />
        </div>
        <hr className="border-t border-gray-300" />
            <PaymentForm sale={sale}/>
      </div>
    </>
  );
};

export default PaymentDrawer;