'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export type ChartDataType = {
  month: string;
  balance: number;
};

const chartConfig = {
  balance: {
    label: <p className='font-semibold mr-1 text-docduit-yellow'>Rp</p>,
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function BarChartComponent({ data }: { data: ChartDataType[] }) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideIndicator hideLabel />}
        />
        <Bar dataKey='balance' fill='hsl(var(--chart-1))' radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
