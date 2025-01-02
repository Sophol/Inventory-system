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
    companyLogo,
    address,
    phone,
    exchangeRateD,
    exchangeRateT,
    settingId,
  } = validatedData.params!;
  try {
    const setting = await Setting.findById(settingId);
    if (!setting) {
      throw new Error("Category not found");
    }
    if (
      setting.companyName !== companyName ||
      setting.companyLogo !== companyLogo ||
      setting.address !== address ||
      setting.phone !== phone ||
      setting.exchangeRateD !== exchangeRateD ||
      setting.exchangeRateT !== exchangeRateT
    ) {
      setting.companyName = companyName;
      setting.companyLogo = companyLogo;
      setting.address = address;
      setting.phone = phone;
      setting.exchangeRateD = exchangeRateD;
      setting.exchangeRateT = exchangeRateT;
      await setting.save();
    }
    return { success: true, data: JSON.parse(JSON.stringify(setting)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
