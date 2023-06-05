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
  weightState?: MeasurementState;
}

export const WithingsContext = createContext<WithingsContextValue>({});

export const useWithingsContext = () => useContext(WithingsContext);


const MEASURE_TYPE = {
  weight: 1,
  fatMass: 8,
  muscleMass: 76
}

type WithingsContextProviderProps = {
  children: ReactNode;
}

export function WithingsContextProvider({
  children
}: WithingsContextProviderProps) {
  const { user } = useUserContext()

  const [accessResponse, setAccessResponse] = useState<AccessResponse | undefined>(user?.withings);

  const [weightState, setWeightState] = useState<MeasurementState>();
  const [fatMassState, setFatMassState] = useState<MeasurementState>();
  const [muscleMassState, setMuscleMassState] = useState<MeasurementState>();


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

  //
  // get withings measurements
  //

  const wState = useWithingsMeasurements({
    inputs: {
      accessToken: accessResponse?.access_token,
      refreshToken: accessResponse?.refresh_token,
      measureType: MEASURE_TYPE.weight,
    }
  })

  // only called once
  useEffect(() => {
    if (!wState || weightState) return;
    console.log('settings weightState', wState);
    setWeightState(wState)
  }, [wState])

  const mmState = useWithingsMeasurements({
    inputs: {
      accessToken: accessResponse?.access_token,
      refreshToken: accessResponse?.refresh_token,
      measureType: MEASURE_TYPE.muscleMass,
    }
  })

  // only called once
  useEffect(() => {
    if (!mmState || muscleMassState) return;
    console.log('settings muclemass', mmState);
    setMuscleMassState(mmState)
  }, [mmState])

  const fmState = useWithingsMeasurements({
    inputs: {
      accessToken: accessResponse?.access_token,
      refreshToken: accessResponse?.refresh_token,
      measureType: MEASURE_TYPE.fatMass,
    }
  })

  // only called once
  useEffect(() => {
    if (!fmState || fatMassState) return;
    console.log('settings fatmass', fmState);
    setFatMassState(fmState)
  }, [fmState])

  //

  return (
    <WithingsContext.Provider value={{ redirectUrlState, accessResponse, setAccessResponse, weightState }
    }>
      {
        children
      }
    </WithingsContext.Provider>
  );
}
