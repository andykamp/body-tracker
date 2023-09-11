import withingsApi from '@/withings/api';
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react';
import type * as t from '@/withings-client/types';
import userApi from '@/diet-server/user/user.api';
import { GET_DATA_URL } from '@/withings-client/constants'
import { _fetch, parse } from '@/common/utils/utils.fetch'

// redirect timeouts after 30 seconds
const REDIRECT_TIMEOUT = 30 * 60 * 1000

export type RedirectState = {
  error?: any;
  isFetching?: boolean;
  isLoading?: boolean;
  accessCodeLink?: string;
}

type UseWithingsRedirectUrlProps = {
  enabled: boolean;
}

export function useGetAccess({
  enabled
}: UseWithingsRedirectUrlProps): RedirectState {

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getAuthCode'],
    queryFn: () => withingsApi.getAuthCode(),
    enabled
  })

  const accessCodeLink = data

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, REDIRECT_TIMEOUT);

    // clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [refetch]);

  return { accessCodeLink, isLoading, isFetching, error }
}

const getData = async (accessResponse: t.AccessResponse, userId: string) => {
  console.log('WITHINGS_FETCHING', );
  let accessToken = accessResponse?.access_token
  const hasExpired = withingsApi.checkIfAccessTokenExpired(accessResponse.access_token_created, accessResponse.expires_in)
  console.log('WHITINGS_HAR_EXPIRED?', hasExpired);

  if (hasExpired) {
    console.log('whitings_refreshing token', );
    const refreshReponse = await withingsApi.refreshAccessToken({ refreshToken: accessResponse.refresh_token });
    console.log('WITHINGS_REFRESH_ACCESSTOKEN', refreshReponse);
    // update user with new access token
    userApi.updateUser({ uid: userId, user: { withings: refreshReponse } });
    // use new access token
    accessToken = refreshReponse.access_token
  }

  const res = await _fetch(GET_DATA_URL, {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
  });
  console.log('WITHINGS_RESPONSE', res)
  const data = await parse(res)
  console.log('WITHINGS_DATA', data);
  return data
}

type useDataProps = {
  userId: string;
  accessResponse?: t.AccessResponse
}

export function useData({
  userId,
  accessResponse
}: useDataProps){

  const { data, isLoading, error } = useQuery({
    queryKey: ['getWithingsData'],
    queryFn: () => getData(accessResponse as t.AccessResponse, userId),
    enabled: !!userId && !!accessResponse?.access_token
  })

  return { data, error, isLoading } as t.DataState
}

