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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
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

  // State to manage the selected month and chart data
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [chartData, setChartData] = useState(initialChartData);
  const [totalRevenue, setTotalRevenue] = useState(0);
  let convertedData: ChartConfig = {};
  console.log("chartData", chartData);
  if (chartData.length > 0) {
    convertedData = chartData.reduce(
      (
        acc: { [key: string]: { label: string; color: string } },
        { province, fill }
      ) => {
        if (province !== null && province !== undefined) {
          acc[province] = {
            label: province.charAt(0).toUpperCase() + province.slice(1),
            color: fill,
          };
        }
        return acc;
      },
      {}
    ) satisfies ChartConfig;
  }

  useEffect(() => {
    const fetchExpenseData = async () => {
      console.log("monthString", selectedMonth);
      const revenueResponse = await getRevenueByProvince({
        searchMonth: selectedMonth,
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

    fetchExpenseData();
  }, [selectedMonth]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Revenue Distribution</CardTitle>
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
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={convertedData}
          className="mx-auto aspect-square max-h-[300px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="province" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="province"
              cx="50%"
              cy="50%"
              outerRadius={100}
            ></Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total expense: <Currency amount={totalRevenue} /> this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
