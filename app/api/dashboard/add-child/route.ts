import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request: Request) {
  try {
    const { childId } = await request.json();

    if (!childId) {
      return NextResponse.json({ error: 'Missing childId' }, { status: 400 });
    }

    // Fetch the child's details from the database
    const { rows } = await sql`
      SELECT outbound_child_payment_ref 
      FROM children 
      WHERE child_id = ${childId}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Child not found.' },
        { status: 404 }
      );
    }

    const { outbound_child_payment_ref } = rows[0];

    // Retrieve values from environment variables
    const epp_unique_customer_id = process.env.EPP_UNIQUE_CUSTOMER_ID;
    const epp_reg_reference = process.env.EPP_REG_REFERENCE;

    if (!epp_unique_customer_id || !epp_reg_reference) {
      return NextResponse.json(
        { error: 'Missing environment variables.' },
        { status: 500 }
      );
    }

    // Prepare the payload for HMRC API
    const payload = {
      epp_unique_customer_id,
      epp_reg_reference,
      outbound_child_payment_ref,
    };

    // Generate a unique Correlation-ID
    const correlationId = uuidv4();

    // Make the API request to HMRC
    const response = await fetch('https://test-api.service.hmrc.gov.uk/individuals/tax-free-childcare/payments/link', {
      method: 'POST',
      headers: {
      'Authorization': `Bearer ${process.env.HMRC_API_TOKEN}`,
      'Accept': 'application/vnd.hmrc.1.2+json',
      'Content-Type': 'application/json',
      'Correlation-ID': correlationId,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: response.status });
    }
  } catch (error) {
    console.error('Error linking TFC account:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
