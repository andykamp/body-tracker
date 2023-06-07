import { useWithingsContext } from "@/withings-client/Provider";
import { Card, AreaChart, Title, Text } from '@tremor/react';

type InputData = {
  date: number;
  measures: { value: number; unit: number; }[];
};

type OutputData = {
  time: number;
  [key: string]: number
};

function adjustValueByUnit(value: number, unit: number): number {
  const decimalFactor = Math.pow(10, Math.abs(unit));
  return unit < 0 ? value / decimalFactor : value * decimalFactor;
}

function parseData(data: InputData[], outputName: string): OutputData[] {
  return data.map(({ date, measures }) => {
    const time = date * 1000

    let totalValue = 0;
    measures.forEach(measure => {
      totalValue += adjustValueByUnit(measure.value, measure.unit);
    });

    const averageValue = totalValue / measures.length;

    return { time, [outputName]: averageValue };
  });
}


function WithingsBodyComposition() {
  const { measurementState } = useWithingsContext();
  if (!measurementState) return null;

  const { measurements, error, isLoading } = measurementState;
  console.log('measurements', measurements);
  const { fatMass, muscleMass } = measurements || {};

  if (error) return <div>{error}</div>
  if (isLoading) return <div>Loading...</div>
  if (!fatMass || !muscleMass) return null;

  const parsedFatMass = parseData(fatMass.measuregrps, 'fatMass')
  const parsedMuscleMass = parseData(muscleMass.measuregrps, 'muscleMass');
  const parsedData = parsedFatMass.map(( _, index) => ({time: _.time, fatMass: _.fatMass, muscleMass: parsedMuscleMass[index].muscleMass}))

  return (
    <Card className="mt-8">
      <Title>Body Composition</Title>
      <Text>Your Fat vs Muscle</Text>
      <AreaChart
        className="mt-4 h-80"
        data={parsedData}
        index="time"
        categories={['fatMass', 'muscleMass']}
        colors={["cyan", "red"]}
      />
    </Card>
  )
}

export default WithingsBodyComposition;
