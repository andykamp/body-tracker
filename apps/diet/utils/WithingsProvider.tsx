import { ReactNode, useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { useUserContext } from './UserProvider';
import useWithingsMeasurements, { MeasurementState, useWithingsRedirectUrl } from './withings.utils';
import { RedirectState } from '@/diet/utils/withings.utils';

export type AccessResponse = {
  access_token: string;
  refresh_token: string;
}
export type AccessResponseError = {
  error: string;
}

interface WithingsContextValue {
  accessResponse?: AccessResponse;
  setAccessResponse?: (accessResponse: AccessResponse) => void;
  redirectUrlState?: RedirectState;
  measurementState?: MeasurementState;
}

export const WithingsContext = createContext<WithingsContextValue>({});

export const useWithingsContext = () => useContext(WithingsContext);

type WithingsContextProviderProps = {
  children: ReactNode;
}

export function WithingsContextProvider({
  children
}: WithingsContextProviderProps) {
  const { user } = useUserContext()

  const [accessResponse, setAccessResponse] = useState<AccessResponse | undefined>(user?.withings);

  const [measurementState, setMeasurementState] = useState<MeasurementState>();

  // get redirect url
  // @todo: rename to getAuthCodeUrl
  const redirectUrlState = useWithingsRedirectUrl({
    enabled: !accessResponse
  })
  console.log('redirectUrlState', redirectUrlState);

  // update the access response when user is updated
  useEffect(() => {
    if (!user?.withings) return;
    console.log('userwhitingsupdated', user.withings);
    setAccessResponse(user?.withings)
  }, [user?.withings])

  // get withings measurements
  const mState = useWithingsMeasurements({
    accessResponse
  })

  // only called once
  useEffect(() => {
    if (!mState || measurementState) return;
    console.log('settings measurementState', mState);
    setMeasurementState(mState)
  }, [mState])

  return (
    <WithingsContext.Provider value={{ redirectUrlState, accessResponse, setAccessResponse, measurementState }
    }>
      {
        children
      }
    </WithingsContext.Provider>
  );
}
