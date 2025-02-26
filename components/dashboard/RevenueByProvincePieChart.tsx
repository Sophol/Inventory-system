"use client";

import { useState, useEffect } from "react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import Currency from "../Currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React from "react";
import { getRevenueByProvince } from "@/lib/actions/dashboard.action";
import { useTranslations } from "next-intl";
import CustomTooltip from "./CustomTooltip";

interface ChartRevenueData {
  province: string;
  revenue: number;
  fill: string;
}

export function RevenueByProvincePieChart({
  initialChartData,
}: {
  initialChartData: ChartRevenueData[];
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const t = useTranslations("erp");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // State to manage the selected month, year, and chart data
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState(initialChartData);
  const [totalRevenue, setTotalRevenue] = useState(0);

  let convertedData: ChartConfig = {};
  if (chartData.length > 0) {
    convertedData = chartData.reduce(
      (
        acc: { [key: string]: { label: string; color: string } },
        { province, fill }
      ) => {
        if (province !== null && province !== undefined) {
          acc[province] = {
            label: t(province),
            color: fill,
          };
        }
        return acc;
      },
      {}
    ) satisfies ChartConfig;
  }
  const renderCustomLabel = ({
    name,
    value,
  }: {
    name: string;
    value: number;
  }) => {
    console.log(name);
    return ` ${value.toLocaleString()}`;
  };
  useEffect(() => {
    const fetchRevenueData = async () => {
      const revenueResponse = await getRevenueByProvince({
        searchMonth: selectedMonth,
        searchYear: selectedYear,
      });
      const revenueData = revenueResponse?.data ?? [];
      const revenueChart = Array.isArray(revenueData)
        ? revenueData.map(
            (item: { province: string; revenue: number; fill: string }) => ({
              province: item.province,
              revenue: item.revenue,
              fill: item.fill,
            })
          )
        : [];
      const totalRevenue = revenueChart.reduce(
        (acc, item) => acc + item.revenue,
        0
      );
      setChartData(revenueChart);
      setTotalRevenue(totalRevenue);
    };

    fetchRevenueData();
  }, [selectedMonth, selectedYear]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="mb-2">{t("revenueByProvince")}</CardTitle>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger
              className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {months.map((key) => {
                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {key}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={convertedData}
          className="mx-auto aspect-square max-h-[330px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="province"
              label={renderCustomLabel}
              innerRadius={60}
              cx="50%"
              cy="50%"
              outerRadius={100}
            ></Pie>
            {totalRevenue > 0 && (
              <ChartLegend
                content={<ChartLegendContent nameKey="province" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:justify-center"
              />
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mb-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          {t("totalRevenue")}: <Currency amount={totalRevenue} />
        </div>
      </CardFooter>
    </Card>
  );
}
