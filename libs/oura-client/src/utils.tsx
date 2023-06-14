import type * as t from '@/oura-client/types';
import { GET_DATA_URL } from '@/oura-client/constants'
import { _fetch, parse } from '@/common/utils/utils.fetch'
import {
  useQuery,
} from '@tanstack/react-query'

const getData = async (accessToken: string) => {
  console.log('OURA_FETCHING', accessToken);
  const res = await _fetch(GET_DATA_URL, {
    method: 'POST',
    body: JSON.stringify({ accessToken, startDate: '2023-01-01', endDate: '2023-05-05' }),
  });
  console.log('OURA_RESPONSE', res)
  const data = await parse(res)
  console.log('OURA_DATA', data);
  return data
}

type useDataProps = {
  accessToken?: string
}

export function useData({
  accessToken
}: useDataProps): t.DataState {

  const { data, isLoading, error } = useQuery({
    queryKey: ['getOuraData'],
    queryFn: () => getData(accessToken),
    enabled: !!accessToken
  })

  return { data, error, isLoading }
}

