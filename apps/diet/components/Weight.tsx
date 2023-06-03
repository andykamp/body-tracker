import withingsApi from '@/withings/withings.api';
import {
  useQuery,
} from '@tanstack/react-query'
import { useUserContext } from "@/diet/utils/UserProvider";

function Weight() {

  const { user } = useUserContext()
  const showGetAuthCode = !!user && !user?.withings
  const accessToken = user?.withings?.access_token

  const codeQuery = useQuery({
    queryKey: ['getAuthCode'],
    queryFn: () => withingsApi.getAuthCode(),
    enabled: showGetAuthCode
  })

  const query = useQuery({
    queryKey: ['getMeasurements'],
    queryFn: () => withingsApi.getMeasurements({
      accessToken: accessToken ,
      measureType: 1,
      lastUpdate: 0,
    }),
    enabled: accessToken
  })

  const redirectUrl = codeQuery.data
  console.log('redirectUrl', codeQuery, redirectUrl);
  const measurements = query.data
  console.log('measurements', measurements);

  return (
    <div>
      {showGetAuthCode && <a href={redirectUrl}>click here to get access</a>}

      <div> Measurements</div>
      <pre>
        {JSON.stringify(measurements, null, 2)}
      </pre>
    </div>
  )
}

export default Weight;
