import { useWithingsContext } from "@/withings-client/Provider";
import { Card, AreaChart, Title, Text } from '@tremor/react';
import graphApi from '@/withings/graph/graph.api'

function WithingsWeight() {
  const { dataState } = useWithingsContext();
  if (!dataState) return null;

  const { data, error, isLoading } = dataState;

  // error handling
  if (isLoading) return <div>Loading weight...</div>
  if (error) return <div>{error.message}</div>
  if (!data) return null;

  // extract data
  const { weight } = data

  // parse data
  const parsedData = graphApi.getWeightData(weight.measuregrps);
  const weekAvg = graphApi.getWeekAvg(parsedData);
  console.log('wee',parsedData, weekAvg );

  return (
    <>
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
    <Card className="mt-8">
      <Title>Week Avg- Weight</Title>
      <Text>Your body weight over time</Text>
      <AreaChart
        className="mt-4 h-80"
        data={weekAvg}
        index="time"
        categories={['weight']}
        colors={["cyan"]}
      />
    </Card>
    </>
  )
}

export default WithingsWeight;
