import { Card, AreaChart, Title, Text } from '@tremor/react';

type InputData = {
  date: number;
  measures: { value: number; unit: number; }[];
};

type OutputData = { time: number; value: number; };

function adjustValueByUnit(value: number, unit: number): number {
  const decimalFactor = Math.pow(10, Math.abs(unit));
  return unit < 0 ? value / decimalFactor : value * decimalFactor;
}

function parseData(data: InputData[]): OutputData[] {
  return data.map(({ date, measures }) => {
    const time = date * 1000

    let totalValue = 0;
    measures.forEach(measure => {
      totalValue += adjustValueByUnit(measure.value, measure.unit);
    });

    const averageValue = totalValue / measures.length;

    return { time, value: averageValue };
  });
}

type ChartInput = {
  data: InputData[]
}

export default function Chart({
  data
}: ChartInput) {
  const parsedData = parseData(data);
  console.log('parsedDat',parsedData);
  return (
    <Card className="mt-8">
      <Title>Performance</Title>
      <Text>Comparison between Sales and Profit</Text>
      <AreaChart
        className="mt-4 h-80"
        data={parsedData}
        index="time"
        categories={['weight']}
      />
    </Card>
  );
}

