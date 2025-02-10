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
import { getAllExpense } from "@/lib/actions/dashboard.action";

// Define the type for chartExpenseData
interface ChartExpenseData {
  expense: string;
  amount: number;
  fill: string;
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
  purchase: {
    label: "Purchase Expense",
    color: "hsl(197 37% 24%)",
  },
  general: {
    label: "General Expense",
    color: "hsl(11.92deg 75.88% 60.98%)",
  },
  mission: {
    label: "Mission Expense",
    color: "hsl(26.71deg 86.9% 67.06%)",
  },
  salary: {
    label: "Salary Expense",
    color: "hsl(43 74% 66%)",
  },
} satisfies ChartConfig;

export function ExpensePieChart({
  initialChartData,
  initialTotalExpense,
}: {
  initialChartData: ChartExpenseData[];
  initialTotalExpense: number;
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
  const [totalExpense, setTotalExpense] = useState(initialTotalExpense);

  useEffect(() => {
    const fetchExpenseData = async () => {
      console.log("monthString", selectedMonth);
      const updatedExpenseData = await getAllExpense({
        searchMonth: selectedMonth,
      });

      setChartData([
        {
          expense: "purchase",
          amount: updatedExpenseData.data?.totalPurchase ?? 0,
          fill: "var(--color-purchase)",
        },
        {
          expense: "general",
          amount: updatedExpenseData.data?.totalGeneral ?? 0,
          fill: "var(--color-general)",
        },
        {
          expense: "mission",
          amount: updatedExpenseData.data?.totalMission ?? 0,
          fill: "var(--color-mission)",
        },
        {
          expense: "salary",
          amount: updatedExpenseData.data?.totalSalary ?? 0,
          fill: "var(--color-salary)",
        },
      ]);
      setTotalExpense(updatedExpenseData.data?.totalExpenses ?? 0);
    };

    fetchExpenseData();
  }, [selectedMonth]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Distribution</CardTitle>
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
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="expense" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="expense"
              cx="50%"
              cy="50%"
              outerRadius={100}
            ></Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total expense: <Currency amount={totalExpense} /> this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
