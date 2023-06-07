import withingsApi from '@/withings/withings.api';
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react';
import type * as t from '@/withings-client/types';
import userApi from '@/diet-server/user/user.api';

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

type useWithingsMeasurementsProps = {
  userId?: string;
  accessResponse?: t.AccessResponse
}

function useWithingsMeasurements({
  userId,
  accessResponse
}: useWithingsMeasurementsProps): t.MeasurementState {

  const [measurements, setMeasurements] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  console.log('useWithingsMeasurements', accessResponse);

  useEffect(() => {
    if (!accessResponse || !userId) return;

    const fetchWeightData = async () => {
      let accessToken = accessResponse?.access_token
      try {
        setIsLoading(true);
        setError(undefined);
        console.log('FETCHING_MEASUREMENTS', accessToken);

        const hasExpired = withingsApi.checkIfAccessTokenExpired(accessResponse.access_token_created, accessResponse.expires_in)
        console.log('hasEXPIRED', hasExpired);

        if (hasExpired) {
          const refreshReponse = await withingsApi.refreshAccessToken({ refreshToken: accessResponse.refresh_token });
          console.log('REFRESH', refreshReponse);
          // update user with new access token
          userApi.updateUser({ uid: userId, user: { withings: refreshReponse } });
          // use new access token
          accessToken = refreshReponse.access_token
        }

        const response = await fetch('/api/getWeightData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accessToken,
          })
        });
        console.log('response', response)
        console.log('TODO should update user with accessToken mutation',);
        const data = await response.json();
        // update accesstoken if needed
        // Do something with the data
        console.log('getWeightData', data);
        setMeasurements(data);
      } catch (error: any) {
        console.log(error);
        setError(error.message || 'Error occured');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeightData();
  }, [accessResponse, userId]);

  console.log('measurementsmmmm,', measurements);
  return { measurements, error, isLoading }
}

export default useWithingsMeasurements;
