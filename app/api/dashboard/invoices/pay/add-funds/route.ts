import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const appId = process.env.YAPILY_APPLICATION_ID;
    const appSecret = process.env.YAPILY_APPLICATION_SECRET;

    if (!appId || !appSecret) {
      console.error('Yapily credentials are missing.');
      return NextResponse.json(
        { error: 'Yapily credentials are not properly configured.' },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${appId}:${appSecret}`).toString('base64');

    console.log('Sending request to Yapily API...');

    const response = await fetch('https://api.yapily.com/institutions', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    console.log('Yapily API Response Status:', response.status);

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error('Yapily API Error:', response.status, response.statusText, errorResponse);
      return NextResponse.json(
        {
          error: `Failed to fetch institutions: ${response.statusText}`,
          details: errorResponse,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('Institutions fetched successfully:', data);

    return NextResponse.json({ institutions: data });
  } catch (error: unknown) {
    // Check if error is an instance of Error
    if (error instanceof Error) {
      console.error('Unexpected error in API route:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred.', details: error.message },
        { status: 500 }
      );
    } else {
      // In case error is not an instance of Error, handle it
      console.error('Unexpected error in API route:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred.', details: 'Unknown error' },
        { status: 500 }
      );
    }
  }
}
