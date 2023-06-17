import { useOuraContext } from "@/oura-client/Provider";
import { Card, AreaChart, Title, Text } from '@tremor/react';
import type * as t from '@/oura/types';
import { parseSleepData, parseSleepDataWeeklyAverage } from '@/oura/utils/utils.sleep';

function OuraSleep() {
  const { dataState } = useOuraContext();
  if (!dataState) return null;

  const { data, error, isLoading } = dataState;
  // error handling
  if (isLoading) return <div>Loading oura sleep...</div>
  if (error) return <div>{error.message}</div>
  if (!data) return null;

  // extract data
  const { sleep } = data

  // parse data
  const parsedData = parseSleepData(sleep?.data);
  const parsedWeekData = parseSleepDataWeeklyAverage(parsedData);

  return (
    <div>
      <Card className="mt-8">
        <Title>Sleep</Title>
        <Text>Your time in bed vs actual sleep</Text>
        <AreaChart
          className="mt-4 h-80"
          data={parsedData}
          index="time"
          categories={['timeInBed', 'totalSleep']}
          colors={["cyan", "blue"]}
        />
      </Card>
      <Card className="mt-8">
        <Title>Sleep avg</Title>
        <Text>Your time in bed vs actual sleep</Text>
        <AreaChart
          className="mt-4 h-80"
          data={parsedWeekData}
          index="week"
          categories={['averageTimeInBed', 'averageSleep']}
          colors={["cyan", "blue"]}
        />
      </Card>

    </div>
  )
}

export default OuraSleep;
