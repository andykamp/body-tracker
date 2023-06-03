import { createHmac } from 'crypto';
import { v4 as uuid } from 'uuid';
import { createFormBody } from '@/withings/utils';
// const timestamp = Date.now();
const timestamp = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds

// see https://web.postman.co/workspace/2bdccbac-c484-4dfb-b164-7631036384aa/request/23220387-932d145f-4a68-4bd1-89e3-a3aa42fcd12b

// Helper function to generate the signature
function generateSignature(): string {
  const clientId = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
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
  console.log('nonce', nonce);
  return nonce;
}

async function getNonce(): Promise<string> {

  const signature = generateSignature();
  const nonce = await fetchNonce(signature);
  return nonce;
}

async function getAuthCode(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_WITHINGS_OAUTH2_REDIRECT_URI;
  const state = uuid()
  const scope = process.env.NEXT_PUBLIC_WITHINGS_SCOPE;

  if (!clientId || !redirectUri || !scope) {
    throw new Error('Required environment variable is not defined');
  }

  const url = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}`;

  try {
    console.log('getting auth code', url);
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`Failed to get authorization code: ${response.status} ${response.statusText}`);
    }

    // Handle the response as needed
    console.log('token1', response.redirected, response.url)
    // const responseData = await response.json();
    // console.log('Authorization response:', responseData);
    return response.url
  }
  catch (e) {
    console.error(e);
    return ''
  }

}

// Define your other functions for Withings API here
// ...

type GetAccessTokenInput = {
  code: string
}

async function getAccessToken({ code }: GetAccessTokenInput): Promise<any> {
  const clientId = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_WITHINGS_OAUTH2_REDIRECT_URI;
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

  console.log('getAccessToken', url, body);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: createFormBody(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}


async function refreshAccesstoken(): Promise<void> {
  // ...
}

type GetMeasurementsInput = {
  measureType: number,
  lastUpdate: number
}

async function getMeasurements({
  measureType = 1, // 1 is weight
  lastUpdate = 0
}: GetMeasurementsInput): Promise<void> {
  const nonce = await withingsApi.getNonce()
  const code = await withingsApi.getAuthCode()
  // console.log('nounce', nonce );
  // console.log('code', code );

  const oneDayInSeconds = 24 * 60 * 60;
  lastUpdate = timestamp - oneDayInSeconds;

  const accessToken = process.env.NEXT_PUBLIC_WITHINGS_ACCESS_TOKEN;

  const url = 'https://scalews.withings.com/measure';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${accessToken}`,
  };
  const body: Record<string, any> = {
    action: 'getmeas',
    meastypes: measureType,
    lastupdate: lastUpdate,
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
  const responseData = await response.json();
  console.log('Measurements response:', responseData);
}

const withingsApi = {
  generateSignature,
  fetchNonce,
  getNonce,
  getAuthCode,
  getAccessToken,
  refreshAccesstoken,

  getMeasurements,

};

export type WithingsApi = typeof withingsApi;
export default withingsApi;

