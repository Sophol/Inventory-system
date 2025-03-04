"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { getUniqueRandomColors } from "@/lib/url";
import { useTranslations } from "use-intl";
import CustomTooltip from "./CustomTooltip";

export function YearlyPrfoit({ annaulSummary }: { annaulSummary: any }) {
  const t = useTranslations("erp");
  const chartConfig = {
    sale: {
      label: t("sale"),
      color: getUniqueRandomColors(0),
    },
    cost: {
      label: t("cost"),
      color: getUniqueRandomColors(1),
    },
    service: {
      label: t("service"),
      color: getUniqueRandomColors(3),
    },
    expense: {
      label: t("expense"),
      color: getUniqueRandomColors(4),
    },
    delivery: {
      label: t("delivery"),
      color: getUniqueRandomColors(5),
    },
    profit: {
      label: t("profit"),
      color: getUniqueRandomColors(6),
    },
  } satisfies ChartConfig;
  const formatNumber = (value: number): string => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (absValue >= 1000000) {
      let formatted = (absValue / 1000000).toFixed(1);
      if (formatted.endsWith(".0")) {
        formatted = formatted.slice(0, -2);
      }
      return sign + formatted + "M";
    } else if (absValue >= 1000) {
      let formatted = (absValue / 1000).toFixed(1);
      if (formatted.endsWith(".0")) {
        formatted = formatted.slice(0, -2);
      }
      return sign + formatted + "K";
    } else {
      return sign + absValue.toString();
    }
  };
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center">
          <CardTitle>{t("yearlyProfitLoss")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <ChartContainer config={chartConfig}>
              <BarChart
                width={600}
                height={300}
                data={annaulSummary}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  //tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickFormatter={formatNumber} />
                <ChartTooltip cursor={false} content={<CustomTooltip />} />
                <Bar dataKey="sale" fill="var(--color-sale)" radius={4} />
                <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
                <Bar dataKey="service" fill="var(--color-service)" radius={4} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                <Bar
                  dataKey="delivery"
                  fill="var(--color-delivery)"
                  radius={4}
                />
                <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
