import { createHmac } from 'crypto';

// see https://web.postman.co/workspace/2bdccbac-c484-4dfb-b164-7631036384aa/request/23220387-932d145f-4a68-4bd1-89e3-a3aa42fcd12b

// Helper function to generate the signature
function generateSignature(clientSecret: string, clientId: string, nonce: string): string {
  const signedParams = {
    action: 'activate',
    client_id: clientId,
    nonce: nonce,
  };

  const sortedParams = Object.keys(signedParams)
    .sort()
    .reduce((obj, key) => {
      obj[key] = signedParams[key];
      return obj;
    }, {});

  const data = Object.values(sortedParams).join(',');
  const signature = createHmac('sha256', clientSecret).update(data).digest('hex');
  return signature;
}


async function getNonce(): Promise<string> {
  const clientId = process.env.WITHINGS_CLIENT_ID;

  const nonceResponse = await fetch('https://api.withings.com/v2/nonce', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
    }),
  });

  if (!nonceResponse.ok) {
    throw new Error('Failed to retrieve nonce.');
  }

  const { nonce } = await nonceResponse.json();
  return nonce;
}

async function getSignature(): Promise<string> {
  const clientSecret = process.env.WITHINGS_CLIENT_SECRET;
  const clientId = process.env.WITHINGS_CLIENT_ID;

  const nonce = await getNonce();
  const signature = generateSignature(clientSecret, clientId, nonce);
  return signature;
}

async function getAuthCode(): Promise<void> {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  const state = 'your_state_value';
  const scope = 'your_scope_value';

  const baseUrl = 'https://account.withings.com/oauth2_user/authorize2';
  const url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get authorization code: ${response.status} ${response.statusText}`);
  }

  // Handle the response as needed
  const responseData = await response.json();
  console.log('Authorization response:', responseData);
}

// Define your other functions for Withings API here
// ...

async function getAccessToken(): Promise<void> {
  // ...
}

async function refreshAccesstoken(): Promise<void> {
  // ...
}

const withingsApi = {
  generateSignature,
  getNonce,
  getSignature,
  getAuthCode,
  getAccessToken,
  refreshAccesstoken,

};

export type WithingsApi = typeof withingsApi;
export default withingsApi;

