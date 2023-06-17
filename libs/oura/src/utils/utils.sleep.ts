import type * as t from '@/oura/types';

type InputData = t.SleepData;

type OutputData = {
  time: number
  totalSleep: number
  timeInBed: number
};

type IntermediateData = {
  [key: string]: {
    totalSleep: number;
    timeInBed: number;
  };
};

export function parseSleepData(data: InputData[]): OutputData[] {
  const aggregatedData = data.reduce<IntermediateData>((acc, { day, total_sleep_duration, time_in_bed }) => {
    if (!acc[day]) {
      acc[day] = { totalSleep: 0, timeInBed: 0 };
    }

    acc[day].totalSleep += total_sleep_duration / 60 / 60;
    acc[day].timeInBed += time_in_bed / 60 / 60;

    return acc;
  }, {});

  return Object.entries(aggregatedData).map(([day, { totalSleep, timeInBed }]) => {
    return {
      time: new Date(day).getTime(),
      totalSleep,
      timeInBed,
    };
  });
}

type WeekData = {
  week: string;
  totalSleep: number;
  timeInBed: number;
  daysCount: number;
};

type OutputWeekData = {
  week: string;
  averageSleep: number;
  averageTimeInBed: number;
};

export function parseSleepDataWeeklyAverage(data: OutputData[]): OutputWeekData[] {
  const weekData = data.reduce<Record<string, WeekData>>((acc, { time, totalSleep, timeInBed }) => {
    const date = new Date(time);
    const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;

    if (!acc[week]) {
      acc[week] = { week, totalSleep: 0, timeInBed: 0, daysCount: 0 };
    }

    acc[week].totalSleep += totalSleep;
    acc[week].timeInBed += timeInBed;
    acc[week].daysCount += 1;

    return acc;
  }, {});

  return Object.values(weekData).map(({ week, totalSleep, timeInBed, daysCount }) => {
    return {
      week,
      averageSleep: totalSleep / daysCount,
      averageTimeInBed: timeInBed / daysCount,
    };
  });
}
