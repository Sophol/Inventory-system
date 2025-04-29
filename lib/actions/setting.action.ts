"use server";
import { Setting } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { EditSettingSchema, GetSettingSchema } from "../validations";
import { ISettingDoc } from "@/database/setting.model";

export async function getSetting(
  params: GetSettingParams
): Promise<ActionResponse<Setting>> {
  const validatedData = await action({
    params,
    schema: GetSettingSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { settingId } = validatedData.params!;
  try {
    const setting = await Setting.findById(settingId);
    if (!setting) {
      throw new Error("Setting not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(setting)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function editSetting(
  params: EditSettingParams
): Promise<ActionResponse<ISettingDoc>> {
  const validatedData = await action({
    params,
    schema: EditSettingSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const {
    companyName,
    companyNameEnglish,
    companyLogo,
    address,
    phone,
    exchangeRateD,
    exchangeRateT,
    settingId,
    companyOwner,
    vat_number,
    bankName,
    bankAccount,
    bankNumber,
    phone1,
    email,
    website,
    facebook,
    instagram,
    telegram,
    lat,
    lng,
  } = validatedData.params!;
  try {
    const setting = await Setting.findById(settingId);
    if (!setting) {
      throw new Error("Category not found");
    }
    if (
      setting.companyName !== companyName ||
      setting.companyNameEnglish !== companyNameEnglish ||
      setting.companyLogo !== companyLogo ||
      setting.address !== address ||
      setting.phone !== phone ||
      setting.exchangeRateD !== exchangeRateD ||
      setting.exchangeRateT !== exchangeRateT ||
      setting.companyOwner !== companyOwner ||
      setting.vat_number !== vat_number ||
      setting.bankName !== bankName ||
      setting.bankAccount !== bankAccount ||
      setting.phone1 !== phone1 ||
      setting.email !== email ||
      setting.website !== website ||
      setting.facebook !== facebook ||
      setting.instagram !== instagram ||
      setting.telegram !== telegram ||
      setting.lat !== lat ||
      setting.lng !== lng
    ) {
      setting.companyName = companyName;
      setting.companyNameEnglish = companyNameEnglish;
      setting.companyLogo = companyLogo;
      setting.address = address;
      setting.phone = phone;
      setting.exchangeRateD = exchangeRateD;
      setting.exchangeRateT = exchangeRateT;
      setting.companyOwner = companyOwner;
      setting.vat_number = vat_number;
      setting.bankName = bankName;
      setting.bankAccount = bankAccount;
      setting.bankNumber = bankNumber;
      setting.phone1 = phone1;
      setting.email = email;
      setting.website = website;
      setting.facebook = facebook;
      setting.instagram = instagram;
      setting.telegram = telegram;
      setting.lat = lat;
      setting.lng = lng;
      await setting.save();
    }
    return { success: true, data: JSON.parse(JSON.stringify(setting)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
