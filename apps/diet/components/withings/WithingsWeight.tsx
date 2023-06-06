import { useWithingsContext } from "@/withings-client/Provider";
import WeightChart from '../WeightChart';

function WithingsWeight() {
  const { measurementState } = useWithingsContext();
  if (!measurementState) return null;

  const { measurements, error, isLoading } = measurementState;

  if (error) return <div>{error}</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <div> Measurements</div>
      {measurements?.weight ?
        <>
          <WeightChart data={(measurements?.weight as any)?.measuregrps} />
          <pre>
            {JSON.stringify(measurements, null, 2)}
          </pre>
        </>
        : <div>No weight found</div>
      }
    </div>
  )
}

export default WithingsWeight;
