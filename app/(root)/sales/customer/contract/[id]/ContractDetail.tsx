import React from "react";
import "./invoice.css";
import { moulRegular } from "../../../../../fonts/fonts";
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
          <h4 className="flex justify-center text-center  font-moul text-sm"  style={{ lineHeight: '1.5rem' }}>
            ព្រះរាជាណាចក្រកម្ពុជា
            <br />
            ជាតិ សាសនា ព្រះមហាក្សត្រ
            <br />
          </h4>
          <img src="/images/underline.png" alt="underline" width={120} height={50} className="flex justify-center text-center mx-auto pt-1 -mb-2" />
          <br />
          <h4 className="flex justify-center text-center font-moul text-sm pt-0 " style={{ lineHeight: '1.5rem' }}>
            កិច្ចសន្យាផ្គត់ផ្គង់ថ្នាំបង្កក និងបង្កើនទិន្នផលជ័រកៅស៊ូ និង
            <br />
            ប្រចាំខេត្ត/ស្រុក [-]
          </h4>
          <p className="flex justify-center text-center pt-2">
            ធ្វើនៅថ្ងៃទី      ខែ            ឆ្នាំ២០២
          </p>
          <h4 className="flex justify-center text-center font-moul text-sm py-2">
            រវាង
          </h4>

          <div className="flex space-x-5 ">
            {/*  Part 1 */}
            <div className="flex flex-col flex-grow  font-moul text-sm">
              <p className="w-[70px] pt-[4.5px]">ភាគី “ក”</p>
            </div>

            <div className="flex flex-col">
              <p>
                ក្រុមហ៊ុន [-] ជាក្រុមហ៊ុនទទួលខុសត្រូវមានកម្រិត បានចុះបញ្ជីស្របតាមច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា មានលេខចុះបញ្ជី [-] និងអាសយដ្ឋានស្ថិតនៅ តំណាងដោយលោក [-] ជាអភិបាលក្រុមហ៊ុន ហៅកាត់ថា ជាម្ចាស់ផលិតផល និងជាអ្នកផ្គត់ផ្គង់ មានលេខទូរស័ព្ទ [-]។
              </p>
            </div>
          </div>

          <h4 className="flex justify-center text-center font-moul text-sm pb-2">
            និង
          </h4>
          <div className="flex space-x-5">
            {/* Part 2 */}
            <div className="flex flex-col flex-grow">
              <p className="w-[70px]  font-moul text-sm pt-[4.5px]">ភាគី “ខ”</p>
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
              <p className=" w-[120px] text-sm font-moul pt-[4.5px]">ដោយហេតុថា៖</p>
            </div>

            <div className="flex flex-col">
              <p>
                ភាគី “ក” ជាក្រុមហ៊ុននាំចូលផលិតផលថ្នាំ និងសារធាតុសម្រាប់បង្កក និងបង្កើនទិន្នផលជ័រកៅស៊ូ ដែលមានប្រភពមកពីប្រទេសថៃ ហើយភាគី “ខ” ជាម្ចាស់ដេប៉ូលក់ជី និងថ្នាំសម្រាប់ដំណាំកសិកម្មនៅក្នុងខេត្ត/ស្រុក [-]។
              </p>
            </div>
          </div>
          <h4 className="flex justify-center text-center pt-5  font-moul text-sm">
            ភាគីទាំងពីរបានព្រមព្រៀងគ្នាតាមបណ្តាលក្ខខណ្ឌដូចខាងក្រោមនេះ ៖
          </h4>
          <h4 className="  py-2  font-moul text-sm">
            ប្រការ ១៖ ផលិតផល
          </h4>
          <p className="indent-10">
            ភាគី “ក” យល់ព្រមធ្វើជាអ្នកផ្គត់ផ្គង់ និងលក់ “ថ្នាំបង្កក និងបង្កើនទិន្នផលជ័រកៅស៊ូ” ម៉ាក [-] ដែលនាំចូលដោយផ្ទាល់ពីប្រទេសថៃ (ហៅកាត់ថា “ផលិតផល”) (មានភ្ជាប់រូប និងព័ត៌មានអំពីផលិតផលនៅក្នុងឧបសម្ព័ន្ធ១ នៃកិច្ចសន្យានេះ) ឱ្យភាគី “ខ” ដើម្បីភាគី “ខ”យកទៅលក់ និងចែកចាយផ្តាច់មុខនៅក្នុងខេត្ត/ស្រុក [-] តាមតម្រូវការជាក់ស្តែង។
          </p>

          <h4 className="  py-2  font-moul text-sm">
            ប្រការ ២៖ ការបញ្ជាទិញ
          </h4>
          <div className="flex space-x-1">
            {/* Part 2 */}
            <div className="flex flex-col flex-grow">
              <p className="w-[40px]">២.២</p>
            </div>

            <div className="flex flex-col">
              <p>
                បន្ទាប់ពីបង់ប្រាក់កក់រួច និងមុនពេលដែលភាគី “ក” ដឹកជញ្ជូនផលិតផលទៅដល់ទីតាំងរបស់ភាគី “ខ” ភាគី “ខ” មានការកែប្រែ ដោយលុបចោលការបញ្ជាទិញវិញ នោះភាគី “ខ” ត្រូវជូនដំណឹងទៅភាគី “ក” ឱ្យបានឆាប់ដែលអាចធ្វើទៅបាន និងយល់ព្រមបោះបង់ប្រាក់កក់ដែលបានបង់រួចទៅឱ្យភាគី “ក”។
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            {/* Part 2 */}
            <div className="flex flex-col flex-grow">
              <p className="w-[40px]">២.១</p>
            </div>
            <div className="flex flex-col">
              <p>
                នៅពេលភាគី “ខ” មានតម្រូវការផលិតផល ភាគី “ខ” ត្រូវជូនដំណឹងមកភាគី”ក” ជាមុន នូវបរិមាណផលិតផល តាមរយៈការហៅទូរស័ព្ទ ឬបណ្តាញទំនាក់ទំនងសង្គម ជា Telegram, Facebook Messenger ឬ Line ជាដើម និងត្រូវកក់ប្រាក់ចំនួន ២០% (ម្ភៃភាគរយ) នៃចំនួនបញ្ជាទិញសរុបជាមុន ជូនភាគី “ក”។
              </p>
            </div>
          </div>
        </div>
        <h4 className={` py-2 font-moul text-sm`}>
          ប្រការ ៣៖ ការដឹកជញ្ជូន
        </h4>
        <p className="indent-10">
          បន្ទាប់ពីភាគី”ក” ទទួលបានការបញ្ជាទិញ និងប្រាក់កក់ពីភាគី “ខ” រួច ភាគី “ក” ត្រូវចាត់ចែងការផ្គត់ផ្គង់តាមរយៈការដឹកជញ្ជូន មកដល់ទីតាំងអាជីវកម្មផ្ទាល់របស់ភាគី “ខ” ឬទីតាំងដែលភាគី “ខ” បានជូនដំណឹងជាមុន យ៉ាងយូរបំផុតរយៈពេល ១៥ ថ្ងៃ ដោយភាគី “ក” ជាអ្នកចំណាយលើសោហ៊ុយដឹកជញ្ជូនទាំងស្រុង។
        </p>
        <h4 className={` py-2 font-moul text-sm`}>
          ប្រការ ៤៖ ការទូទាត់ប្រាក់
        </h4>
        <div className="flex space-x-1">
          <div className="flex flex-col flex-grow">
            <p className="w-[40px]">៤.១</p>
          </div>
          <div className="flex flex-col">
            <p>
              គូភាគីព្រមព្រៀងទទួលយកការទូទាត់តាមចំនួនដែលមានបញ្ជាក់ក្នុងវិក្កយបត្រ ឬប័ណ្ណទទួលផលិតផល ដែលបានប្រគល់ទទួលជាក់ស្តែង។ ភាគី”ក” ត្រូវចេញជូន ភាគី”ខ” ជាវិក្កយបត្រ ឬប័ណ្ណទទួលផលិតផល រៀងរាល់ពេលដឹកបញ្ជូនផលិតផលទៅដល់ទីតាំងរបស់ភាគី “ខ”។
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="flex flex-col flex-grow">
            <p className="w-[40px]">៤.២</p>
          </div>
          <div className="flex flex-col">
            <p>
              ស្របតាមប្រការ ២.១ ខាងលើ នៅពេលទទួលបានផលិតផលតាមការបញ្ជាទិញ ភាគី “ខ” យល់ព្រមទូទាត់ថ្លៃផលិតផល ចំនួន ៨០% ដែលនៅសេសសល់នៃចំនួនបញ្ជាទិញសរុប ក្នុងរយៈពេល ១ ថ្ងៃ ជូនភាគី “ក” បន្ទាប់ពីគូភាគីបានពិនិត្យមើលផលិតផលថាត្រឹមត្រូវតាមការបញ្ជាទិញ។
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="flex flex-col ">
            <p className="w-[40px]">៤.៣</p>
          </div>
          <div className="flex flex-col">
            <p>
              ការទូទាត់ប្រាក់កក់ និងថ្លៃផលិតផល ត្រូវធ្វើឡើងតាមរយៈការផ្ទេរប្រាក់ចូលគណនីរបស់ភាគី “ក” ដែលមានព័ត៌មានដូចខាងក្រោម៖
              <br />
              ធនាគារឈ្មោះ [-]
              <br />
              គណនីឈ្មោះ [-]
              <br />
              គណនីលេខ [-]
            </p>
          </div>
        </div>
        <h4 className={` py-2 font-moul text-sm`}>
          ប្រការ ៥៖ កាតព្វកិច្ចរបស់ភាគី “ក”
        </h4>
        <div className="flex space-x-1">
          <div className="flex flex-col w-[40px]">
            <p className="w-[40px]">៥.១</p>
          </div>
          <div className="flex flex-col">
            <p>
              នៅពេលមានការបញ្ជាទិញពីភាគី “ខ”  នោះភាគី”ក” ត្រូវផ្គត់ផ្គង់ផលិតផលតាមប្រភេទ និងចំនួន ព្រមទាំងតាមរយៈពេលដឹកជញ្ជូន ដែលមានកំណត់ក្នុងកិច្ចសន្យានេះ។
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="flex flex-col w-[40px]">
            <p className="w-[40px]">៥.២</p>
          </div>
          <div className="flex flex-col ">
            <p>
              ភាគី “ក” យល់ព្រមផ្គត់ផ្គង់ផលិតផលផ្តាច់មុខជូនភាគី “ខ” ក្នុងដែនអាជីវកម្មនៃខេត្ត/ស្រុក [-]។
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="flex flex-col flex-grow">
            <p className="w-[40px]">៥.៣</p>
          </div>
          <div className="flex flex-col">
            <p>
              ក្នុងរយៈពេល ៣ ខែ បន្ទាប់ពីបញ្ជាទិញ ក្នុងករណីភាគី “ខ” មិនអាចលក់ចេញផលិតផលដែលបានបញ្ជាទិញអស់ពីស្តុក ភាគី”ក” ធានាផ្សព្វផ្សាយនិងរកទីផ្សារផលិតផលជាលក្ខណៈឌីជីថល តាមរយៈបណ្តាញសង្គមក្នុងស្រុក ដើម្បីបង្កើនការលក់ចេញរបស់ភាគី “ខ” ។
            </p>
          </div>
        </div>
        <h4 className={` py-2 font-moul text-sm`}>
          ប្រការ ៦៖ កាតព្វកិច្ចរបស់ភាគី “ខ”
        </h4>
        <div className="flex space-x-1">
          <div className="flex flex-col">
            <p className="w-[40px]">៦.១</p>
          </div>
          <div className="flex flex-col">
            <p>
              ភាគី “ខ” យល់ព្រមថា ភាគី “ខ” ត្រូវទទួលទិញផលិតផលផ្តាច់មុខពីភាគី “ក” តែម្នាក់ប៉ុណ្ណោះសម្រាប់ដែនអាជីវកម្មរបស់ខ្លួននៅក្នុងខេត្ត/ស្រុក [-]។
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="flex flex-col  w-[40px]">
            <p className="w-[40px]">៦.២</p>
          </div>
          <div className="flex flex-col">
            <p>
              ភាគី “ខ” ត្រូវលក់ចេញផលិតផលទៅឱ្យតែអ្នកប្រើប្រាស់ចុងក្រោយប៉ុណ្ណោះ។
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="flex flex-col  w-[40px]">
            <p className="w-[40px]">៦.៣</p>
          </div>
          <div className="flex flex-col">
            <p>
              ភាគី “ខ” មិនអាចចែកចាយឬផ្គត់ផ្គង់ផលិតផលបន្តទៅឱ្យអាជីវករ ឬម្ចាស់ដេប៉ូផ្សេងដាច់ខាត ដែលមានដែនអាជីវកម្មនៅក្នុងខេត្ត/ស្រុកតែមួយជាមួយនឹងភាគី “ខ”។
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="flex flex-col w-[40px]">
            <p className="w-[40px]">៦.៤</p>
          </div>
          <div className="flex flex-col">
            <p>
              ភាគី “ខ” ត្រូវគោរពអនុវត្តតាមប្រការ ២.១ ប្រការ ៤.២ និងប្រការ ៤.៣ ខាងលើទាក់ទងនឹងការកក់ប្រាក់ និងទូទាត់ថ្លៃផលិតផលជូនភាគី “ក” តាមពេលវេលាកំណត់។
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="flex flex-col w-[40px]">
            <p className="w-[40px]">៦.៥</p>
          </div>
          <div className="flex flex-col">
            <p>
              រាល់ការបញ្ជាទិញម្តងៗ ភាគី “ខ” ត្រូវធានាថានឹងលក់ចេញទៅឱ្យអ្នកប្រើប្រាស់ចុងក្រោយក្នុងរយៈពេល ៣ ខែ។
            </p>
          </div>
        </div>
      
      <h4 className={` py-2 font-moul text-sm`}>
        ប្រការ ៧៖ រយៈពេលកិច្ចសន្យា និងការបញ្ចប់កិច្ចសន្យា
      </h4>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៧.១</p>
        </div>
        <div className="flex flex-col">
          <p>
            កិច្ចសន្យានេះមានសុពលភាពរយៈពេល ១២ ខែ រាប់ចាប់ពីថ្ងៃចុះកិច្ចសន្យាតទៅ។
          </p>
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៧.២</p>
        </div>
        <div className="flex flex-col">
          <p>
            ក្នុងករណីភាគីណាមួយមានបំណងចង់បន្តរយៈពេលនៃកិច្ចសន្យា ភាគីនោះត្រូវជូនដំណឹងទៅភាគីម្ខាងទៀតចំនួន ១ ខែជាមុន ដើម្បីពិភាក្សា និងចរចា លើលក្ខខណ្ឌថ្មី។
          </p>
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៧.៣</p>
        </div>
        <div className="flex flex-col">
          <p>
            ក្នុងករណីភាគីណាមួយមានបំណង់ចង់រំលាយកិច្ចសន្យាមុនពេលកំណត់ ភាគីនោះត្រូវជូនដំណឹងទៅភាគីម្ខាងទៀត ចំនួន ១ ខែជាមុន ជាលាយលក្ខណ៍អក្សរ ដោយមានបញ្ជាក់ពីកាលបរិច្ឆេទនៃការបញ្ចប់កិច្ចសន្យាមុនកាលកំណត់។ ដរាបណាកិច្ចសន្យាមិនទាន់បញ្ចប់ រាល់កាតព្វកិច្ចរបស់ភាគី “ក” ស្របតាមប្រការ ៥ នៃកិច្ចសន្យានេះ និងរាល់កាតព្វកិច្ចរបស់ភាគី “ខ” ស្របតាមប្រការ ៦ នៃកិច្ចសន្យានេះ ត្រូវបន្តអនុវត្តដដែលរហូតដល់ផលិតផលលក់អស់ចេញពីស្តុក។
          </p>
        </div>
      </div>
      <h4 className={` py-2 font-moul text-sm`}>
        ប្រការ ៨៖ ការមិនអនុវត្តកាតព្វកិច្ច
      </h4>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៨.១</p>
        </div>
        <div className="flex flex-col">
          <p>
            ករណីការទូទាត់ប្រាក់ថ្លៃផលិតផលក្នុងប្រការ ៤.២ ខាងលើ មានការយឺតយ៉ាវ នោះភាគី “ក” មានសិទ្ធិក្នុងការជ្រើសរើសខាងក្រោម៖
            <br />
            ក. ឱ្យភាគី “ខ” ត្រូវបង់ការប្រាក់ពិន័យក្នុងចំនួន ១% ក្នុងមួយខែ នៃចំនួនទឹកប្រាក់ដែលមិនទាន់ទូទាត់ រហូតដល់មានការទូទាត់ប្រាក់គ្រប់ចំនួន ឬ
            <br />
            ខ. ភាគី “ក” ប្រមូលយកផលិតផលមកវិញទាំងអស់ និងរក្សាទុកប្រាក់កក់ ដែលបានបង់ដោយភាគី “ខ” ទាំងអស់។
          </p>
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៨.២</p>
        </div>
        <div className="flex flex-col">
          <p>
            ក្នុងករណីភាគី “ក” មិនអនុវត្តតាមកាតព្វកិច្ចរបស់ខ្លួនស្របតាមប្រការ ៣ ខាងលើ ភាគី “ក” ត្រូវជូនដំណឹងទៅភាគី “ខ” ឱ្យបានឆាប់ដែលអាចធ្វើទៅបាន និងត្រូវប្រគល់ប្រាក់កក់ជូនភាគី “ខ” វិញដោយគ្មានការប្រាក់ ឬសំណងបន្ថែមឡើយ។
          </p>
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៨.៣</p>
        </div>
        <div className="flex flex-col">
          <p>
            ក្នុងករណីភាគីណាមួយនៃកិច្ចសន្យានេះ មិនអនុវត្តតាមកាតព្វកិច្ចណាមួយដែលមានចែងក្នុងកិច្ចសន្យានេះ ភាគីម្ខាងទៀត ត្រូវជូនដំណឹងទៅភាគីនោះដើម្បីដាស់តឿនការអនុវត្តកាតព្វកិច្ច ដោយមានកំណត់រយៈពេលឱ្យអនុវត្តតាមកាតព្វកិច្ចរបស់ខ្លួន។ ប្រសិនបើនៅតែមិនមានការកែប្រែណាមួយបន្ទាប់ពីមានការដាស់តឿនចំនួន ២ ដងរួច ភាគីម្ខាងទៀតអាចរំលាយកិច្ចសន្យានេះបាន ដោយអនុវត្តតាមប្រការ ៨.១, និងប្រការ ៨.២ ខាងលើ។
          </p>
        </div>
      </div>
      <h4 className={` py-2 font-moul text-sm`}>
        ប្រការ ៩៖ បញ្ញត្តិផ្សេងៗ
      </h4>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៩.១</p>
        </div>
        <div className="flex flex-col">
          <p>
            កិច្ចសន្យានេះធ្វើឡើងដោយឆន្ទៈរបស់ភាគីទាំងអស់ ដោយសេរី គ្មានការបង្ខិតបង្ខំ ឬគំរាមកំហែងពីភាគីណាមួយឡើយ ។ ភាគីទាំងអស់សន្យាថានឹងគោរពតាមលក្ខខណ្ឌខាងលើនេះ ។
          </p>
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៩.២</p>
        </div>
        <div className="flex flex-col">
          <p>
            កិច្ចសន្យានេះមានអានុភាពអនុវត្តចាប់តាំងពីថ្ងៃចុះហត្ថលេខានេះតទៅ និងបញ្ចប់ដោយស្វយប្រវត្តិតាមប្រការ ៧.១ ខាងលើ។
          </p>
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៩.៣</p>
        </div>
        <div className="flex flex-col">
          <p>
            ភាគីទាំងអស់បានអាន និងពិនិត្យយ៉ាងត្រឹមត្រូវនូវខ្លឹមសារនៃកិច្ចសន្យានេះ ថាពិតជាត្រឹមត្រូវ និងឯកភាពទាំងស្រុងនូវបណ្តាលក្ខខណ្ឌខាងលើ និងទទួលខុសត្រូវចំពោះមុខច្បាប់ និងសុខចិត្តផ្តិតស្នាមមេដៃ ចុះហត្ថលេខា និងបោះត្រាក្រុមហ៊ុន ទុកជាភស្តុតាង ។
          </p>
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="flex flex-col w-[40px]">
          <p className="w-[40px]">៩.៤</p>
        </div>
        <div className="flex flex-col">
          <p>
            កិច្ចសន្យានេះធ្វើឡើងចំនួន ៤ ច្បាប់ដើម ដោយ ៖
            <br />
          
              <span className="mr-7">- ០១ ច្បាប់ សំរាប់ភាគី “ក”</span>
              <span className="mr-7">- ០១ ច្បាប់ សំរាប់ភាគី “ខ”</span>
              <span>- ០២ ច្បាប់ សំរាប់ សាក្សីម្នាក់ៗ ។</span>
            
          </p>
        </div>
      </div>
      {/* table */}
      <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-dotted border-black mt-5">
        <tbody>
          <tr>
            <td className="border border-dotted border-black px-4 py-2 w-[49.5%] text-center font-moul text-sm">
              ភាគី “ក”
              <br />
              ក្រុមហ៊ុន [-]
            </td>
            <td className="border border-dotted border-black px-2 py-2 w-[1%]"></td>
            <td className="border border-dotted border-black px-4 py-2 w-[49.5%] text-center font-moul text-sm">ភាគី “ខ”
              <br />
              ហត្ថលេខា និង ស្នាមមេដៃស្តាំ
            </td>
          </tr>
          <tr>
            <td className="border border-dotted border-black px-4 py-2 h-[140px]"></td>
            <td className="border border-dotted border-black px-3 py-2"></td>
            <td className="border border-dotted border-black px-4 py-2"></td>
          </tr>
          <tr>
            <td className="border border-dotted border-black px-4 h-[30px]">តំណាងដោយលោក [-]</td>
            <td className="border border-dotted border-black px-3  h-[30px]"></td>
            <td className="border border-dotted border-black pl-10 h-[30px]">ឈ្មោះ  .........................................</td>
          </tr>
          <tr>
            <td className="border border-dotted border-black px-4  h-[30px]"></td>
            <td className="border border-dotted border-black px-3  h-[30px]"></td>
            <td className="border border-dotted border-black px-4 h-[30px]"></td>
          </tr>
          <tr>
            <td className="border border-dotted border-black px-4 py-2 font-moul text-sm text-center">សាក្សី 
              <br />
ហត្ថលេខា និងស្នាមមេដៃស្តាំ
</td>
            <td className="border border-dotted border-black px-2 py-2"></td>
            <td className="border border-dotted border-black px-4 py-2 font-moul text-sm text-center">សាក្សី
              <br />
ហត្ថលេខា និងស្នាមមេដៃស្តាំ
</td>
          </tr>
          <tr>
            <td className="border border-dotted border-black px-4 py-2 h-[140px]"></td>
            <td className="border border-dotted border-black px-2 py-2"></td>
            <td className="border border-dotted border-black px-4 py-2"></td>
          </tr>
          <tr>
          <td className="border border-dotted border-black pl-10 h-[30px]">ឈ្មោះ  .........................................</td>
            <td className="border border-dotted border-black px-3  h-[30px]"></td>
            <td className="border border-dotted border-black pl-10 h-[30px]">ឈ្មោះ  .........................................</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div >
    </div>
  );
};

export default ContractDetail;
