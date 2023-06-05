import { useWithingsContext } from "../../utils/WithingsProvider";
import WeightChart from '../WeightChart';

function WithingsWeight() {
  const {measurementState} = useWithingsContext();
  if(!measurementState) return null;

  const {measurements, error, isLoading} = measurementState;

  if (error) return <div>{error}</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <div> Measurements</div>
      {measurements ?
        <>
          <WeightChart data={(measurements as any)?.measuregrps} />
          <pre>
            {JSON.stringify(measurements, null, 2)}
          </pre>
        </>
        : <div>No measurements found</div>
      }
    </div>
  )
}

export default WithingsWeight;
