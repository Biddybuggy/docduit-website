'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export type ForexChartDataType = {
  month: string;
  common: number;
  forex: number;
};

const chartConfig = {
  forex: {
    label: (
      <div className='flex gap-4 justify-between'>
        <p className='font-light'>Valas</p>
        <p className='font-semibold mr-1 text-docduit-blue'>Rp</p>
      </div>
    ),
    color: 'hsl(var(--chart-3))',
  },
  common: {
    label: (
      <div className='flex gap-4 justify-between'>
        <p className='font-light'>Biasa</p>
        <p className='font-semibold mr-1 text-docduit-yellow'>Rp</p>
      </div>
    ),
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function ForexChart({ data }: { data: ForexChartDataType[] }) {
  return (
    <ChartContainer
      className='lg:min-w-[500px] min-w-[300px]'
      config={chartConfig}
    >
      <AreaChart
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator='dot' />}
        />
        <Area
          dataKey='common'
          type='natural'
          fill='var(--color-common)'
          fillOpacity={0.4}
          stroke='var(--color-common)'
          stackId='a'
        />
        <Area
          dataKey='forex'
          type='natural'
          fill='var(--color-forex)'
          fillOpacity={0.4}
          stroke='var(--color-forex)'
          stackId='a'
        />
      </AreaChart>
    </ChartContainer>
  );
}
