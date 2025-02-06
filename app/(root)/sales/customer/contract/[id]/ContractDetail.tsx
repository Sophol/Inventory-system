import React from "react";
import "./invoice.css";
import { getSetting } from "@/lib/actions/setting.action";
import { notFound } from "next/navigation";


const ContractDetail = async ({ customer }: { customer: Customer }) => {

  const { success, data: setting } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!success) return notFound();
  if (!setting) return notFound();
  return (
    <div className="card80 ">
      <div className="printable-area card80-container">
        <div className="sm:flex flex-row justify-between invoice-header">
          <div className="flex flex-col ">
            <div className="flex flex-col">
              <div className="flex flex-col">

                <p className="text-sm">{setting.address}</p>
                <p className="text-sm">{setting.phone}</p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
