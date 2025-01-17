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

    const response = await fetch('https://test-api.service.hmrc.gov.uk/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.error_description }, { status: response.status });
    }

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
