import withingsApi from '@/withings/withings.api';
import { useQuery } from '@tanstack/react-query'
import { AccessResponse } from "@/diet/utils/WithingsProvider";
import { useEffect, useState } from 'react';

// redirect timeouts after 30 seconds
const REDIRECT_TIMEOUT = 30 * 60 * 1000

export type RedirectState = {
  error?: any;
  isFetching?: boolean;
  isLoading?: boolean;
  redirectUrl?: string;
}

type UseWithingsRedirectUrlProps = {
  enabled: boolean;
}

export function useWithingsRedirectUrl({
  enabled
}: UseWithingsRedirectUrlProps): RedirectState {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getAuthCode'],
    queryFn: () => withingsApi.getAuthCode(),
    enabled
  })

  const redirectUrl = data
  console.log('data', data);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, REDIRECT_TIMEOUT);

    // clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [refetch]);

  return { redirectUrl, isLoading, isFetching, error }
}

export type MeasurementState = {
  measurements: any,
  error?: string,
  isLoading: boolean
}

type useWithingsMeasurementsProps = {
  accessResponse?: AccessResponse
}

function useWithingsMeasurements({
  accessResponse
}: useWithingsMeasurementsProps): MeasurementState {

  const [measurements, setM] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const accessToken = accessResponse?.access_token
  const refreshToken = accessResponse?.refresh_token

  useEffect(() => {
    if (!accessToken) return;

    const fetchWeightData = async () => {
      try {
        setIsLoading(true);
        setError(undefined);
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
        console.log('TODO should update user with accessToken mutation',);
        const data = await response.json();
        // update accesstoken if needed
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
  return { measurements, error, isLoading }
}

export default useWithingsMeasurements;
