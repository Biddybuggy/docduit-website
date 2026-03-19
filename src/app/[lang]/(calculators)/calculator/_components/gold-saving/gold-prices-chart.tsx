'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { goldBuyPrice } from '@/lib/constants';

export type GoldPricesChartDataType = {
  type: string;
  attributes: {
    price: number;
    percentage: number;
    movement: string;
    prices: any[];
  };
};

type PricesDataType = {
  buyPrice: number;
  datetime: string;
};

const chartConfig = {
  buyPrice: {
    label: 'Rp',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function GoldPricesChart({
  data,
}: {
  data: GoldPricesChartDataType;
}) {
  const pricesData: PricesDataType[] = data.attributes.prices.map((price) => ({
    buyPrice: price.buy_price,
    datetime: price.datetime,
  }));
  const smallestPrice = Math.min(...pricesData.map((price) => price.buyPrice));

  return (
    <div className='w-full flex flex-col gap-4 items-center justify-center'>
      <div className='flex flex-col gap-2 w-full items-center py-2'>
        <p className='font-bold text-lg'>
          Rp{goldBuyPrice.toLocaleString()}
          <span className='font-light text-base'>&nbsp;/gram</span>
        </p>
        <p
          className={cn(
            'font-semibold flex gap-2',
            data.attributes.movement === 'profit'
              ? 'text-docduit-blue'
              : 'text-docduit-red',
          )}
        >
          {data.attributes.movement === 'profit' ? (
            <TrendingUp size={24} />
          ) : (
            <TrendingDown size={24} />
          )}
          Rp{data.attributes.price.toLocaleString()}&nbsp;(
          {data.attributes.movement === 'loss' && '-'}
          {data.attributes.percentage}%)
        </p>
      </div>
      <ChartContainer
        className='min-w-[300px] lg:min-w-[500px]'
        config={chartConfig}
      >
        <AreaChart data={pricesData} width={500}>
          <CartesianGrid vertical={false} />
          <XAxis
            hide={true}
            dataKey='datetime'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis hide={true} domain={[smallestPrice - 10000, 'dataMax']} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator='dot' />}
            defaultIndex={1}
          />
          <Area
            dataKey='buyPrice'
            type='natural'
            fill='var(--color-buyPrice)'
            fillOpacity={0.4}
            stroke='var(--color-buyPrice)'
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
