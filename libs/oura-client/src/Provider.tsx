import { ReactNode, useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { useUserContext } from "@/user-client/Provider";
import useWithingsMeasurements from '@/withings-client/utils';
import type * as t from '@/withings-client/types';


interface WithingsContextValue {
  accessResponse?: t.AccessResponse;
  setAccessResponse?: (accessResponse: t.AccessResponse) => void;
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

  // update the access response when user is updated
  useEffect(() => {
    if (!user?.withings) return;
    console.log('userwhitingsupdated', user.withings);
    setAccessResponse(user?.withings)
  }, [user?.withings])

  // get withings measurements
  const measurementState = useWithingsMeasurements({
    userId: user?.id,
    accessResponse
  })

  return (
    <WithingsContext.Provider value={{ accessResponse, setAccessResponse, measurementState }
    }>
      {
        children
      }
    </WithingsContext.Provider>
  );
}
