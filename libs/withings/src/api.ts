import { createHmac } from 'crypto';
import { v4 as uuid } from 'uuid';
import { createFormBody } from '@/withings/utils';
// const timestamp = Date.now();
const timestamp = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds
import config from '@/withings/config';
import { MEASURE_TYPE } from '@/withings/constants';
import type * as t from '@/withings/types';

// see https://web.postman.co/workspace/2bdccbac-c484-4dfb-b164-7631036384aa/request/23220387-932d145f-4a68-4bd1-89e3-a3aa42fcd12b

// Helper function to generate the signature
function generateSignature(): string {
  const clientId = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Required environment variable is not defined');
    throw new Error('Required environment variable is not defined');
  }

  const data = "getnonce" + "," + clientId + "," + timestamp;
  const signature = createHmac('sha256', clientSecret).update(data).digest('hex');

  return signature;
}

async function fetchNonce(signature: string): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_WITHINGS_BASE_URL;

  const body: Record<string, any> = {
    client_id: clientId,
    action: "getnonce",
    timestamp,
    signature,
  }

  const nonceResponse = await fetch(`${baseUrl}/v2/signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: createFormBody(body),
  });

  if (!nonceResponse.ok) {
    throw new Error('Failed to retrieve nonce.');
  }

  const json = await nonceResponse.json();
  const nonce = json.body.nonce;
  return nonce;
}

async function getNonce(): Promise<string> {

  const signature = generateSignature();
  const nonce = await fetchNonce(signature);
  return nonce;
}

async function getAuthCode(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID;
  const redirectUri = config.redirectUrl
  const state = uuid()
  const scope = process.env.NEXT_PUBLIC_WITHINGS_SCOPE;

  if (!clientId || !redirectUri || !scope) {
    console.error('Required environment variable is not defined');
    throw new Error('Required environment variable is not defined');
  }

  const url = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}`;

  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow'
  });

  if (!response.ok) {
    throw new Error(`Failed to get authorization code: ${response.status} ${response.statusText}`);
  }

  return response.url

}

// Define your other functions for Withings API here
// ...

type GetAccessTokenInput = {
  code: string
}

async function getAccessToken({ code }: GetAccessTokenInput): Promise<t.AccessResponse> {
  const clientId = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_SECRET;
  const redirectUri = config.redirectUrl
  const baseUrl = process.env.NEXT_PUBLIC_WITHINGS_BASE_URL;

  const url = `${baseUrl}/v2/oauth2`;
  const body = {
    action: "requesttoken",
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: createFormBody(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return {
    ...data.body,
    access_token_created: Date.now()
  }
}

type RefreshAccessTokenInput = {
  refreshToken: string
}

async function refreshAccessToken({ refreshToken }: RefreshAccessTokenInput): Promise<t.AccessResponse> {
  const clientId = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_WITHINGS_BASE_URL;

  const url = `${baseUrl}/v2/oauth2`;
  const body = {
    action: "requesttoken",
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: createFormBody(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);

  return {
    ...data.body,
    access_token_created: Date.now()
  }

}

type GetMeasurementsInput = {
  accessToken: string,
  measureType: number,
  lastUpdate?: number
}

async function getMeasureMent({
  accessToken,
  measureType = 1,
  lastUpdate = 0
}: GetMeasurementsInput): Promise<void> {
  // const nonce = await withingsApi.getNonce()
  // const code = await withingsApi.getAuthCode()
  // console.log('nounce', nonce );
  // console.log('code', code );

  const oneDayInSeconds = 24 * 60 * 60;
  lastUpdate = timestamp - oneDayInSeconds;

  // const accessToken = process.env.NEXT_PUBLIC_WITHINGS_ACCESS_TOKEN;

  const url = 'https://scalews.withings.com/measure';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${accessToken}`,
  };
  const body: Record<string, any> = {
    action: 'getmeas',
    meastypes: measureType,
    // lastupdate: lastUpdate,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: createFormBody(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to get measurements: ${response.status} ${response.statusText}`);
  }

  // Handle the response as needed
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  console.log('WITHINGS_MEASUREMENTS response:', data);
  return data.body
}

async function getData(accessToken: string) {
  const weightPromise = withingsApi.getMeasureMent({
    accessToken,
    measureType: MEASURE_TYPE.weight,
  });
  const muscleMassPromise = withingsApi.getMeasureMent({
    accessToken,
    measureType: MEASURE_TYPE.muscleMass,
  });
  const fatMassPromise = withingsApi.getMeasureMent({
    accessToken,
    measureType: MEASURE_TYPE.fatMass,
  });

  try {
    const [weight, muscleMass, fatMass] = await Promise.all([
      weightPromise,
      muscleMassPromise,
      fatMassPromise,
    ]);

    const data: t.Data = {
      weight,
      muscleMass,
      fatMass,
    };

    return data;
  } catch (error) {
    // Handle the error here
    console.error('Error occurred while fetching data:', error);
    throw error; // Optional: Rethrow the error if needed
  }
}

function checkIfAccessTokenExpired(
  accessTokenCreated: number,
  expiresIn: number
) {
  const now = Date.now();
  const expiresAt = accessTokenCreated + (expiresIn * 1000);
  const isExpired = now > expiresAt;
  return isExpired;
}

const withingsApi = {
  generateSignature,
  fetchNonce,
  getNonce,
  getAuthCode,
  getAccessToken,
  refreshAccessToken,

  checkIfAccessTokenExpired,
  getMeasureMent,
  getData,

};

export type WithingsApi = typeof withingsApi;
export default withingsApi;

