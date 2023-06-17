
function adjustValueByUnit(value: number, unit: number): number {
  const decimalFactor = Math.pow(10, Math.abs(unit));
  return unit < 0 ? value / decimalFactor : value * decimalFactor;
}


type InputData = {
  date: number;
  measures: { value: number; unit: number; }[];
};

type OutputData = {
  time: number;
  [key: string]: number
};

export function parseData(data: InputData[], outputName: string): OutputData[] {
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
