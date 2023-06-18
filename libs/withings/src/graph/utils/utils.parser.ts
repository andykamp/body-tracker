import type * as t from '@/withings/types';

export function adjustValueByUnit(value: number, unit: number): number {
  const decimalFactor = Math.pow(10, Math.abs(unit));
  return unit < 0 ? value / decimalFactor : value * decimalFactor;
}


export function parseData(data: t.MeasureGroup[], outputName: string): t.GraphData[] {
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

export function calculateWeeklyAverage(data: t.GraphData[]): t.GraphData[] {
  const weeklyAverages: t.GraphData[] = [];

  let currentWeek: number | null = null;
  let sum: t.GraphData = { time: 0 };
  let count = 0;

  for (const item of data) {
    const week = getWeekNumber(new Date(item.time));

    if (currentWeek === null) {
      currentWeek = week;
    } else if (currentWeek !== week) {
      const average: t.GraphData = {
        time: sum.time,
      };

      for (const key in sum) {
        if (key !== 'time') {
          average[key] = sum[key] / count;
        }
      }

      weeklyAverages.push(average);

      currentWeek = week;
      sum = { time: item.time };
      count = 0;
    }

    for (const key in item) {
      if (key !== 'time') {
        if (!sum[key]) {
          sum[key] = 0;
        }
        sum[key] += item[key];
      }
    }

    count++;
  }

  if (count > 0) {
    const average: t.GraphData = {
      time: sum.time,
    };

    for (const key in sum) {
      if (key !== 'time') {
        average[key] = sum[key] / count;
      }
    }

    weeklyAverages.push(average);
  }

  return weeklyAverages;
}

function getWeekNumber(date: Date): number {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const millisecondsInDay = 86400000;
  return Math.ceil(((date.getTime() - oneJan.getTime()) / millisecondsInDay + oneJan.getDay() + 1) / 7);
}

