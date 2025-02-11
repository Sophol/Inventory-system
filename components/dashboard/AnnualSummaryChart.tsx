"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

const chartConfig = {
  sale: {
    label: "Sale",
    color: "hsl(173 58% 39%)",
  },
  purchase: {
    label: "Purchase",
    color: "hsl(11.92deg 75.88% 60.98%)",
  },
  profit: {
    label: "Profit",
    color: "hsl(43 74% 66%)",
  },
} satisfies ChartConfig;

export function AnnualSummaryChart({ annaulSummary }: { annaulSummary: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Purchase, Sale and Profit</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={annaulSummary}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="sale" fill="var(--color-sale)" radius={4} />
            <Bar dataKey="purchase" fill="var(--color-purchase)" radius={4} />
            <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mb-4">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
