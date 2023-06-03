import withingsApi from '@/withings/withings.api';
import {
  useQuery,
} from '@tanstack/react-query'

function Weight() {

  const query = useQuery({
    queryKey: ['getMeasurements'],
    queryFn: () => withingsApi.getMeasurements({
      measureType: 1,
      lastUpdate: 0,
    })
  })

  const measurements = query.data
  console.log('measurements', measurements);

  return (
    <div>
      <div> Measurements</div>
    </div>
  )
}

export default Weight;
