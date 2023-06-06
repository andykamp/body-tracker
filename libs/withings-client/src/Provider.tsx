import React from 'react'
import { ReactNode, useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { useUserContext } from '@/diet/utils/UserProvider';
import useWithingsMeasurements, { useAccessCodeLink } from '@/withings-client/utils';
import { RedirectState } from '@/withings-client/utils';
import type * as t from '@/withings-client/types';


interface WithingsContextValue {
  accessResponse?: t.AccessResponse;
  setAccessResponse?: (accessResponse: t.AccessResponse) => void;
  accessCodeLinkState?: RedirectState;
  measurementState?: t.MeasurementState;
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

  const [accessResponse, setAccessResponse] = useState<t.AccessResponse | undefined>(user?.withings);

  const [measurementState, setMeasurementState] = useState<t.MeasurementState>();

  // get redirect url
  // @todo: rename to getAuthCodeUrl
  const accessCodeLinkState = useAccessCodeLink({
    enabled: !accessResponse
  })

  // update the access response when user is updated
  useEffect(() => {
    if (!user?.withings) return;
    console.log('userwhitingsupdated', user.withings);
    setAccessResponse(user?.withings)
  }, [user?.withings])

  // get withings measurements
  const mState = useWithingsMeasurements({
    userId: user?.id,
    accessResponse
  })

  // only called once
  useEffect(() => {
    if (!mState || measurementState) return;
    console.log('settings measurementState', mState);
    setMeasurementState(mState)
  }, [mState])

  return (
    <WithingsContext.Provider value={{ accessCodeLinkState, accessResponse, setAccessResponse, measurementState }
    }>
      {
        children
      }
    </WithingsContext.Provider>
  );
}
