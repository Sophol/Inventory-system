"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{t("yearlyProfitLoss")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={annaulSummary}>
            <defs>
              <linearGradient id="fillSale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sale)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-slae)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPurchase" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-purchase)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-purchase)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillServiceFee" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-serviceFee)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-serviceFee)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillGrossProfit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-grossProfit)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-grossProfit)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-profit)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-profit)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="sale"
              type="natural"
              fill="url(#fillSale)"
              stroke="var(--color-sale)"
              stackId="a"
            />
            <Area
              dataKey="purchase"
              type="natural"
              fill="url(#fillPurchase)"
              stroke="var(--color-purchase)"
              stackId="a"
            />
            <Area
              dataKey="serviceFee"
              type="natural"
              fill="url(#fillServiceFee)"
              stroke="var(--color-serviceFee)"
              stackId="a"
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="url(#fillExpense)"
              stroke="var(--color-expense)"
              stackId="a"
            />
            <Area
              dataKey="grossProfit"
              type="natural"
              fill="url(#fillGrossProfit)"
              stroke="var(--color-grossProfit)"
              stackId="a"
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#fillProfit)"
              stroke="var(--color-profit)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
