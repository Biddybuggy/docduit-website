'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export type GoldChartDataType = {
  month: string;
  common: number;
  gold: number;
};

export default function GoldChart({
  data,
  vocabularies,
}: {
  data: GoldChartDataType[];
  vocabularies: any;
}) {
  const {
    goldSavingSection: { normalLegend, goldLegend },
  } = vocabularies;

  const chartConfig = {
    gold: {
      label: (
        <div className='flex gap-4 justify-between'>
          <p className='font-light'>{goldLegend}</p>
          <p className='font-semibold mr-1 text-docduit-yellow'>Rp</p>
        </div>
      ),
      color: 'hsl(var(--chart-2))',
    },
    common: {
      label: (
        <div className='flex gap-4 justify-between'>
          <p className='font-light'>{normalLegend}</p>
          <p className='font-semibold mr-1 text-docduit-red'>Rp</p>
        </div>
      ),
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;
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
          dataKey='gold'
          type='natural'
          fill='var(--color-gold)'
          fillOpacity={0.4}
          stroke='var(--color-gold)'
          stackId='a'
        />
      </AreaChart>
    </ChartContainer>
  );
}
