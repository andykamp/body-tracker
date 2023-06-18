import { useOuraContext } from "@/oura-client/Provider";
import { Card, AreaChart, Title, Text } from '@tremor/react';
import graphApi from '@/oura/graph/graph.api';

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

  const parsedWeekData =graphApi.getSleepDataWeeklyAverage(sleep?.data);

  return (
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
  )
}

export default OuraSleep;
