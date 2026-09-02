import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const LULU_API_BASE = 'https://api.lulu.com';
const LULU_AUTH_URL =
  'https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token';

interface LuluTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function getAccessToken(): Promise<string> {
  const clientKey = process.env.LULU_CLIENT_KEY;
  const clientSecret = process.env.LULU_CLIENT_SECRET;

  if (!clientKey || !clientSecret) {
    throw new Error(
      'LULU_CLIENT_KEY or LULU_CLIENT_SECRET missing from .env.local'
    );
  }

  const credentials = Buffer.from(`${clientKey}:${clientSecret}`).toString(
    'base64'
  );

  const body = new URLSearchParams();
  body.set('grant_type', 'client_credentials');

  const res = await fetch(LULU_AUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Lulu auth failed (${res.status}) [step 1]: ${errText}`);
  }

  const data = (await res.json()) as LuluTokenResponse;

  if (!data.access_token) {
    throw new Error(
      'Lulu auth response did not contain an access_token: ' +
        JSON.stringify(data)
    );
  }

  // Print only the first 10 chars — never log the full token.
  console.log(`  (token starts with: ${data.access_token.substring(0, 10)}...)`);

  return data.access_token;
}

async function testPrintJobs(token: string): Promise<void> {
  const res = await fetch(`${LULU_API_BASE}/print-jobs/`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GET /print-jobs/ failed (${res.status}): ${errText}`);
  }

  const bodyText = await res.text();
  console.log(`  Status: ${res.status}`);
  console.log(
    `  Response (truncated, first 500 chars): ${bodyText.substring(0, 500)}`
  );
}

interface CostCalcLineItem {
  page_count: number;
  pod_package_id: string;
  quantity: number;
}

interface CostCalcPayload {
  line_items: CostCalcLineItem[];
  shipping_address: {
    name: string;
    street1: string;
    street2: string;
    city: string;
    postcode: string;
    country_code: string;
    state_code: string;
    phone_number: string;
  };
  shipping_level: string;
}

async function testCostCalculation(token: string): Promise<void> {
  const payload: CostCalcPayload = {
    line_items: [
      {
        page_count: 63,
        pod_package_id: '0850X1100BWSTDPB080CW444GXX',
        quantity: 1,
      },
    ],
    shipping_address: {
      name: 'Test User',
      street1: '1 Main Street',
      street2: '',
      city: 'Charlotte',
      postcode: '28202',
      country_code: 'US',
      state_code: 'NC',
      phone_number: '+17045550000',
    },
    shipping_level: 'MAIL',
  };

  const res = await fetch(`${LULU_API_BASE}/print-job-cost-calculations/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `POST /print-job-cost-calculations/ failed (${res.status}): ${errText}`
    );
  }

  const bodyText = await res.text();
  console.log(`  Status: ${res.status}`);
  console.log(
    `  Response (truncated, first 500 chars): ${bodyText.substring(0, 500)}`
  );
}

async function main() {
  console.log('Base URL:', LULU_API_BASE);

  try {
    console.log('\nStep 1: Requesting OAuth token...');
    const token = await getAccessToken();
    console.log('✅ Token acquired');

    console.log('\nStep 2: Testing print-jobs list access...');
    await testPrintJobs(token);
    console.log('✅ Success (status 200)');

    console.log('\nStep 3: Testing cost-calculation POST access...');
    await testCostCalculation(token);
    console.log('✅ Success');

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('\n❌ Failure detail:', message);

    if (message.includes('[step 1]')) {
      console.error(
        '\nAuth failing usually means the key/secret pair is wrong or the account' +
          ' is not provisioned for Lulu Print API access.'
      );
    }

    process.exit(1);
  }
}

main();