import { useWithingsContext } from "@/withings-client/Provider";
import { Card, AreaChart, Title, Text } from '@tremor/react';

type InputData = {
  date: number;
  measures: { value: number; unit: number; }[];
};

type OutputData = { time: number; weight: number; };

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

    return { time, weight: averageValue };
  });
}


function WithingsWeight() {
  const { measurementState } = useWithingsContext();
  if (!measurementState) return null;

  const { measurements, error, isLoading } = measurementState;
  console.log('measurements', measurements);
  const { weight } = measurements || {};
  const { measuregrps } = weight || {};

  if (error) return <div>{error}</div>
  if (isLoading) return <div>Loading...</div>
  if (!measuregrps) return null;

  const parsedData = parseData(measuregrps);

  return (
    <Card className="mt-8">
      <Title>Weight</Title>
      <Text>Your body weight over time</Text>
      <AreaChart
        className="mt-4 h-80"
        data={parsedData}
        index="time"
        categories={['weight']}
        colors={["cyan"]}
      />
    </Card>
  )
}

export default WithingsWeight;
