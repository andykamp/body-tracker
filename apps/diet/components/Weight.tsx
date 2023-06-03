import withingsApi from '@/withings/withings.api';
import {
  useQuery,
} from '@tanstack/react-query'

function Weight() {

  const codeQuery = useQuery({
    queryKey: ['getAuthCode'],
    queryFn: () => withingsApi.getAuthCode()
  })

  const query = useQuery({
    queryKey: ['getMeasurements'],
    queryFn: () => withingsApi.getMeasurements({
      measureType: 1,
      lastUpdate: 0,
    })
  })

  const redirectUrl = codeQuery.data
  console.log('redirectUrl',codeQuery, redirectUrl);
  const measurements = query.data
  console.log('measurements', measurements);

  return (
    <div>
      {}<a href={redirectUrl}>click here to get access</a>

      <div> Measurements</div>
      <pre>
        {JSON.stringify(measurements, null, 2)}
      </pre>
    </div>
  )
}

export default Weight;
