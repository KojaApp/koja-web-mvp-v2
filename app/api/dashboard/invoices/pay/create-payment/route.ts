import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { institutionId, amount, invoiceId } = await request.json();

    // Query to fetch outbound_child_payment_ref from the database
    const result = await sql`
  SELECT c.outbound_child_payment_ref
  FROM invoices i
  JOIN children c ON i.child_id = c.child_id
  WHERE i.invoice_id = ${invoiceId}
  LIMIT 1;
`;

if (!result.rows.length) {
  console.error('No outbound_child_payment_ref found for invoiceId:', invoiceId);
  return NextResponse.json({ error: 'No outbound_child_payment_ref found for the given invoice' });
}

    const outboundChildPaymentRef = result.rows[0].outbound_child_payment_ref;

    // Build the Yapily payment request body
    const body = {
      applicationUserId: 'single-payment-tutorial',
      institutionId,
      callback: 'https://display-parameters.com/',
      paymentRequest: {
        type: 'DOMESTIC_PAYMENT',
        reference: outboundChildPaymentRef,
        paymentIdempotencyId: new Date().toISOString(),
        amount: {
          amount,
          currency: 'GBP',
        },
        payee: {
          name: 'BILLS COFFEE LTD',
          accountIdentifications: [
            { type: 'ACCOUNT_NUMBER', identification: '{accountNumber}' },
            { type: 'SORT_CODE', identification: '{sortCode}' },
          ],
        },
      },
    };

    // Call the Yapily API
    const response = await fetch('https://api.yapily.com/payment-auth-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${process.env.YAPILY_APPLICATION_ID}:${process.env.YAPILY_APPLICATION_SECRET}`
        ).toString('base64')}`,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Error from Yapily API:', responseData);
      return NextResponse.json({ error: responseData }, { status: response.status });
    }

    return NextResponse.json({ success: responseData });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
