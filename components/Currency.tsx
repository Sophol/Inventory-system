import React from "react";
import { formatCurrency } from "@/lib/utils";

interface CurrencyProps {
  amount: number;
  locale?: string;
}

const Currency: React.FC<CurrencyProps> = ({ amount, locale = "km-KH" }) => {
  return <span suppressHydrationWarning>{formatCurrency(amount, locale)}</span>;
};

export default Currency;
