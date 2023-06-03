import withingsApi from '@/withings/withings.api';
import {
  useQuery,
} from '@tanstack/react-query'
import { useUserContext } from "@/diet/utils/UserProvider";
import { useEffect, useState } from 'react';
import WeightChart from './WeightChart';

function Weight() {

  const { user } = useUserContext()
  const showGetAuthCode = !!user //&& !user?.withings
  const accessToken = user?.withings?.access_token
  console.log('user', user);
  const [m, setM] = useState();

  const codeQuery = useQuery({
    queryKey: ['getAuthCode'],
    queryFn: () => withingsApi.getAuthCode(),
    enabled: showGetAuthCode
  })

  // const query = useQuery({
  //   queryKey: ['getMeasurements'],
  //   queryFn: () => withingsApi.getMeasurements({
  //     accessToken: accessToken,
  //     measureType: 1,
  //     lastUpdate: 0,
  //   }),
  //   enabled: accessToken
  // })

  useEffect(() => {
    if (!accessToken) return;
    console.log('calling apiiii', accessToken);
    fetch('/api/getWeightData',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessToken: accessToken,
          measureType: 1,
          // lastUpdate: 0,
        })
      })
      .then(response => {
        console.log('response', response)
        return response
      })
      .then(response => response.json())
      .then(data => {
        // Do something with the data
        console.log('getWeightData', data);
        setM(data.body);
      })
      .catch(err => console.log(err));

  }, [accessToken]);

  const redirectUrl = codeQuery.data
  console.log('redirectUrl', codeQuery, redirectUrl);
  // const measurements = query.data
  // console.log('measurements', measurements);

  console.log('mmmmm,',m );
  return (
    <div>
      <a href={redirectUrl}>click here to get access</a>

      <div> Measurements</div>
      {m && <WeightChart data={(m as any)?.measuregrps} />}
      <pre>
        {JSON.stringify(m, null, 2)}
      </pre>
    </div>
  )
}

export default Weight;
