import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { code, childId } = await request.json();

    if (!code || !childId) {
      return NextResponse.json({ success: false, error: 'Missing code or childId' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_HMRC_CLIENT_ID;
    const clientSecret = process.env.HMRC_CLIENT_SECRET;
    const redirectUri = 'http://localhost:3000/dashboard/add-child/link-tfc-callback';

    // Ensure all required parameters are defined
if (!clientId || !clientSecret || !redirectUri) {
  throw new Error('Missing required parameters for token exchange.');
}

// Proceed with the request
const response = await fetch('https://test-api.service.hmrc.gov.uk/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code: code,
  }).toString(), // Ensure URLSearchParams is serialized to a string
});

// Check if response is successful
if (!response.ok) {
  const error = await response.json();
  console.error("HMRC OAuth error:", error);
  throw new Error('Failed to exchange authorization code for token');
}

// Process the response
const data = await response.json();
console.log('Token exchange successful:', data);
    // Save the tokens in the database
    await sql`
      UPDATE children
      SET access_token = ${data.access_token}, refresh_token = ${data.refresh_token}
      WHERE child_id = ${childId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
