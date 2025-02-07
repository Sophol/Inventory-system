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

        <div className="flex flex-col ">
          <h4 className="flex justify-center text-center font-bold">
            ព្រះរាជាណាចក្រកម្ពុជា
            <br />
            ជាតិ សាសនា ព្រះមហាក្សត្រ
            <br />
          </h4>
          <img src="/images/underline.png" alt="underline" width={120} height={50} className="flex justify-center text-center mx-auto pt-1" />
          <br />
          <h4 className="flex justify-center text-center font-bold">
            កិច្ចសន្យាផ្គត់ផ្គង់ថ្នាំបង្កក និងបង្កើនទិន្នផលជ័រកៅស៊ូ និង
            <br />
            ប្រចាំខេត្ត/ស្រុក [-]
          </h4>
          <p className="flex justify-center text-center pt-2">
            ធ្វើនៅថ្ងៃទី      ខែ            ឆ្នាំ២០២
          </p>
          <h4 className="flex justify-center text-center font-bold">
            រវាង
          </h4>
         
          <div className="flex space-x-5 pt-4">
            {/*  Part 1 */}
            <div className="flex flex-col flex-grow">
              <p className="w-[70px]">ភាគី “ក”</p>
            </div>

            <div className="flex flex-col">
              <p>
                ក្រុមហ៊ុន [-] ជាក្រុមហ៊ុនទទួលខុសត្រូវមានកម្រិត បានចុះបញ្ជីស្របតាមច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា មានលេខចុះបញ្ជី [-] និងអាសយដ្ឋានស្ថិតនៅ តំណាងដោយលោក [-] ជាអភិបាលក្រុមហ៊ុន ហៅកាត់ថា ជាម្ចាស់ផលិតផល និងជាអ្នកផ្គត់ផ្គង់ មានលេខទូរស័ព្ទ [-]។
              </p>
            </div>
          </div>
         
          <h4 className="flex justify-center text-center font-bold">
          និង 
          </h4>
          <div className="flex space-x-5 pt-4">
            {/* Part 2 */}
            <div className="flex flex-col flex-grow">
              <p className="w-[70px]">ភាគី “ខ”</p>
            </div>

            <div className="flex flex-col">
              <p>
              ឈ្មោះ [-] ភេទ[-] កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរលេខ [-] ចុះថ្ងៃទី[-] ខែ[-] ឆ្នាំ [-] មានទីលំនៅ [-] និងមានដេប៉ូចែកចាយប្រចាំខេត្ត/ស្រុក [-] មានអាសយដ្ឋានស្ថិតនៅ [-] ហៅកាត់ថា ភាគីអ្នកទិញ ឬអ្នកលក់រាយ មានលេខទូរស័ព្ទ [-]។ 
              </p>
            </div>
          </div>
          <div className="flex space-x-5 pt-4">
            {/* Part 2 */}
            <div className="flex flex-col flex-grow">
              <p className=" w-[100px]">ដោយហេតុថា៖</p>
            </div>

            <div className="flex flex-col">
              <p>
              ភាគី “ក” ជាក្រុមហ៊ុននាំចូលផលិតផលថ្នាំ និងសារធាតុសម្រាប់បង្កក និងបង្កើនទិន្នផលជ័រកៅស៊ូ ដែលមានប្រភពមកពីប្រទេសថៃ ហើយភាគី “ខ” ជាម្ចាស់ដេប៉ូលក់ជី និងថ្នាំសម្រាប់ដំណាំកសិកម្មនៅក្នុងខេត្ត/ស្រុក [-]។
              </p>
            </div>
          </div>
          <h4 className="flex justify-center text-center font-bold pt-5">
          ភាគីទាំងពីរបានព្រមព្រៀងគ្នាតាមបណ្តាលក្ខខណ្ឌដូចខាងក្រោមនេះ ៖

          </h4>


        </div>

      </div>
    </div>
  );
};

export default ContractDetail;
