"use client";


import React from "react";
import {  FaPrint } from "react-icons/fa";
import { Button } from "@/components/ui/button";


const ContractAction = () => {

  const handlePrintContract = () => {
    window.print();
  };

  
  return (
    <div className="card20">
      <div className="card20-container flex flex-col gap-2">
        <div className="flex gap-2">
    
         
          <Button
            onClick={handlePrintContract}
            className="w-full rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          >
            <FaPrint className="cursor-pointer text-xl" /> Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractAction;

