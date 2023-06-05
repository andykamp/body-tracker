import { useUserContext } from "@/diet/utils/UserProvider";
import { useEffect, useState } from 'react';
import WeightChart from './WeightChart';

function WithingsWeight() {

  const [measurements, setM] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserContext()

  const accessToken = user?.withings?.access_token
  const refreshToken = user?.withings?.refresh_token

  useEffect(() => {
    if (!accessToken) return;

    const fetchWeightData = async () => {
      try {
        setIsLoading(true);
        console.log('calling apiiii', accessToken);
        const response = await fetch('/api/getWeightData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accessToken,
            refreshToken,
            measureType: 1,
            // lastUpdate: 0,
          })
        });
        console.log('response', response)
        console.log('TODO should update user with accessToken mutation', );
        const data = await response.json();
        // Do something with the data
        console.log('getWeightData', data);
        setM(data.body);
      } catch (error: any) {
        console.log(error);
        setError(error.message || 'Error occured');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeightData();
  }, [accessToken]);

  console.log('measurementsmmmm,', measurements);

  if (!accessToken) return <div>No access token found</div>
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
