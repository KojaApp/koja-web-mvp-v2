// app/api/dashboard/invoices/get-child-token/route.ts

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Query to find the associated child ID for the invoice
    const result = await sql`
      SELECT child_id
      FROM invoices
      WHERE invoice_id = ${invoiceId}
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const childId = result.rows[0].child_id;

    // Retrieve the token for the associated child
    const tokenResult = await sql`
      SELECT access_token
      FROM children
      WHERE child_id = ${childId}
    `;

    if (tokenResult.rowCount === 0) {
      return NextResponse.json({ error: 'Token not found for this child' }, { status: 404 });
    }

    // Retrieve the payment reference for the child
    const paymentRefResult = await sql`
      SELECT outbound_child_payment_ref
      FROM children
      WHERE child_id = ${childId}
    `;

    if (paymentRefResult.rowCount === 0) {
      return NextResponse.json({ error: 'Payment reference not found' }, { status: 404 });
    }

    const token = tokenResult.rows[0].access_token;
    const outboundChildPaymentRef = paymentRefResult.rows[0].outbound_child_payment_ref;
    const correlationId = uuidv4();
    const eppUniqueCustomerId = process.env.EPP_UNIQUE_CUSTOMER_ID;
    const eppRegReference = process.env.EPP_REG_REFERENCE;

    // Make the API call to HMRC
    const hmrcResponse = await fetch('https://test-api.service.hmrc.gov.uk/individuals/tax-free-childcare/payments/balance', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.hmrc.1.2+json",
        'Correlation-ID': correlationId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        epp_reg_reference: eppRegReference,
        epp_unique_customer_id: eppUniqueCustomerId,
        outbound_child_payment_ref: outboundChildPaymentRef,
      }),
    });

    if (!hmrcResponse.ok) {
      const errorData = await hmrcResponse.json();
      return NextResponse.json({ error: 'HMRC API call failed', details: errorData }, { status: hmrcResponse.status });
    }

    const hmrcData = await hmrcResponse.json();

    // Return the HMRC response data to the client
    return NextResponse.json(hmrcData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
