import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { childId } = await request.json();
    // Ensure you have valid childId
    if (!childId) {
      return NextResponse.json({ error: 'Missing childId' }, { status: 400 });
    }

    // Your logic for linking the TFC account...
    // You can fetch details from the database and make API calls as needed.

    return NextResponse.json({ message: 'TFC account linked successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while linking the TFC account' }, { status: 500 });
  }
}
