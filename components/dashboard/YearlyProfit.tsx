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
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getUniqueRandomColors } from "@/lib/url";
import { useTranslations } from "use-intl";

export function YearlyPrfoit({ annaulSummary }: { annaulSummary: any }) {
  const t = useTranslations("erp");
  const chartConfig = {
    sale: {
      label: t("sale"),
      color: getUniqueRandomColors(0),
    },
    purchase: {
      label: t("cost"),
      color: getUniqueRandomColors(1),
    },
    serviceFee: {
      label: t("serviceFee"),
      color: getUniqueRandomColors(3),
    },
    expense: {
      label: t("expense"),
      color: getUniqueRandomColors(4),
    },
    grossProfit: {
      label: t("grossProfit"),
      color: getUniqueRandomColors(5),
    },
    profit: {
      label: t("profit"),
      color: getUniqueRandomColors(6),
    },
  } satisfies ChartConfig;
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
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="sale" fill="var(--color-sale)" radius={4} />
                <Bar
                  dataKey="purchase"
                  fill="var(--color-purchase)"
                  radius={4}
                />
                <Bar
                  dataKey="serviceFee"
                  fill="var(--color-serviceFee)"
                  radius={4}
                />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                <Bar
                  dataKey="grossProfit"
                  fill="var(--color-grossProfit)"
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
