"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getUniqueRandomColors } from "@/lib/url";
import { useTranslations } from "use-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { getAnnualSummary } from "@/lib/actions/dashboard.action";

export function MonthlyProfit({ annualSummary }: { annualSummary: any }) {
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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState(annualSummary);

  useEffect(() => {
    const fetchMonthlyProfit = async () => {
      const { data: annaulSummary } = await getAnnualSummary({
        searchYear: selectedYear,
      });
      setChartData(annaulSummary);
    };
    fetchMonthlyProfit();
  }, [selectedYear]);
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
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle className="mb-2">{t("monthlyProfitLoss")}</CardTitle>
        <div className="flex">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger
              className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {years.map((year) => {
                return (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: `var(--color-${year})`,
                        }}
                      />
                      {year}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <ChartContainer config={chartConfig}>
              <BarChart
                width={600}
                height={300}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickFormatter={formatNumber} />
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
