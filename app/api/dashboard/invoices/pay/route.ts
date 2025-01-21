import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { action, invoiceId, payment_amount } = await req.json();

    if (!action || !invoiceId) {
      return NextResponse.json({ error: 'Action and Invoice ID are required' }, { status: 400 });
    }

    // Step 1: Fetch associated child ID and amount for the invoice
    const invoiceResult = await sql`
      SELECT child_id, amount
      FROM invoices
      WHERE invoice_id = ${invoiceId}
    `;

    if (invoiceResult.rowCount === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const { child_id: childId, amount } = invoiceResult.rows[0];

    // Step 2: Fetch all required data for the child
    const childResult = await sql`
      SELECT 
        access_token, 
        outbound_child_payment_ref, 
        ccp_reg_reference, 
        ccp_postcode
      FROM children
      WHERE child_id = ${childId}
    `;

    if (childResult.rowCount === 0) {
      return NextResponse.json({ error: 'Child not found or missing details' }, { status: 404 });
    }

    const { 
      access_token: token, 
      outbound_child_payment_ref: outboundChildPaymentRef, 
      ccp_reg_reference: ccpRegReference, 
      ccp_postcode: ccpPostcode 
    } = childResult.rows[0];

    if (!token || !outboundChildPaymentRef) {
      return NextResponse.json({ error: 'Required child data missing' }, { status: 400 });
    }

    // Step 3: Define shared constants
    const correlationId = uuidv4();
    const eppUniqueCustomerId = process.env.EPP_UNIQUE_CUSTOMER_ID;
    const eppRegReference = process.env.EPP_REG_REFERENCE;

    // Step 4: Handle actions
    if (action === 'checkBalance') {
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
        return NextResponse.json({ error: 'HMRC balance API call failed', details: errorData }, { status: hmrcResponse.status });
      }

      const balanceData = await hmrcResponse.json();
      return NextResponse.json(balanceData);
    }

    if (action === 'payInvoice') {
      const hmrcResponse = await fetch('https://test-api.service.hmrc.gov.uk/individuals/tax-free-childcare/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.hmrc.1.2+json',
          'Correlation-ID': correlationId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          epp_reg_reference: eppRegReference,
          epp_unique_customer_id: eppUniqueCustomerId,
          outbound_child_payment_ref: outboundChildPaymentRef,
          payment_amount: parseFloat(amount), // Use the correct amount from the database
          ccp_reg_reference: ccpRegReference,
          ccp_postcode: ccpPostcode,
          payee_type: 'CCP',
        }),
      });

      if (!hmrcResponse.ok) {
        const errorData = await hmrcResponse.json();
        return NextResponse.json({ error: 'HMRC payment API call failed', details: errorData }, { status: hmrcResponse.status });
      }

      // Extract the values from the response
      const correlationIdFromResponse = hmrcResponse.headers.get('Correlation-ID');
      const paymentResponse = await hmrcResponse.json();
      const { payment_reference, estimated_payment_date } = paymentResponse;

      // Step 5: Update the invoice with the new data
      try {
        await sql`
          UPDATE invoices
          SET correlation_id = ${correlationIdFromResponse},
              payment_reference = ${payment_reference},
              estimated_payment_date = ${estimated_payment_date}
          WHERE invoice_id = ${invoiceId}
        `;
        console.log('Invoice successfully updated with HMRC data');
      } catch (error) {
        console.error('Error updating invoice in database:', error);
        return NextResponse.json({ error: 'Failed to update invoice in database' }, { status: 500 });
      }

      return NextResponse.json({ success: true, 
                                 paymentResponse,
                                 correlationId: correlationId, });
    }

    // Step 6: Handle unsupported actions
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
