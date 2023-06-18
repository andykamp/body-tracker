import { useWithingsContext } from "@/withings-client/Provider";
import { Card, AreaChart, Title, Text } from '@tremor/react';
import graphApi  from '@/withings/graph/graph.api'

function WithingsBodyComposition() {
  const { dataState } = useWithingsContext();
  if (!dataState) return null;

  const { data, error, isLoading } = dataState;

  // error handling
  if (isLoading) return <div>Loading body composition...</div>
  if (error) return <div>{error.message}</div>
  if (!data) return null;
  console.log('data',data );

  // extract data
  const { fatMass, muscleMass } = data
  if (!fatMass || !muscleMass) return null;

  // parse data
  const parsedData = graphApi.getBodyCompositionData(muscleMass.measuregrps, fatMass.measuregrps)

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
