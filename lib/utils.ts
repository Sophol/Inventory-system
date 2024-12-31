import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { techMap } from "../constants/techMaps";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDevIconsClassName = (techName: string) => {
  const normalizeTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return techMap[normalizeTechName]
    ? `${techMap[normalizeTechName]} colored`
    : "devicon-javascript-plain";
};
export const getTimeStamp = (date: Date) => {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};
export const updateLevels = (units: ProductUnit[]): ProductUnit[] => {
  units.sort((a, b) => b.qty - a.qty);
  for (let i = 0; i < units.length; i++) {
    units[i].level = i + 1;
  }
  return units;
};
interface ConvertToSmallUnitParams {
  level: number;
  smallqty: number;
  selectedQty: number;
  qty: number;
}

export const convertToSmallUnit = ({
  level,
  smallqty,
  selectedQty,
  qty,
}: ConvertToSmallUnitParams): number => {
  if (level === 1) {
    return qty * smallqty;
  } else if (level === 2) {
    return selectedQty * qty;
  } else {
    return qty;
  }
};
export function convertFromSmallUnitQty(
  smallUnitQty: number,
  units: ProductUnit[]
): string {
  let remainingQty = smallUnitQty;
  const result: string[] = [];

  for (const unit of units) {
    const unitQty = Math.floor(remainingQty / unit.qty);
    if (unitQty > 0) {
      result.push(`${unitQty} ${unit.unitTitle}${unitQty > 1 ? "s" : ""}`);
      remainingQty %= unit.qty;
    }
  }

  return result.join(" ");
}
