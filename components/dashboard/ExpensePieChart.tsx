"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
    color: "hsl(26.71deg 86.9% 67.06%)",
  },
} satisfies ChartConfig;

export function ExpensePieChart({
  chartData,
}: {
  chartData: ChartExpenseData[];
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Expense Distribution</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
            >
              {/* <LabelList
                dataKey="expense"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              /> */}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
