import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { invoiceId, amount, institutionId } = await req.json();

    if (!invoiceId || !amount || !institutionId) {
      return NextResponse.json(
        { error: "Missing required fields: invoiceId, amount, or institutionId" },
        { status: 400 }
      );
    }

    const { rows: invoiceRows } = await sql`
      SELECT c.outbound_child_payment_ref
      FROM invoices i
      INNER JOIN children c ON i.child_id = c.child_id
      WHERE i.invoice_id = ${invoiceId}
    `;

    if (invoiceRows.length === 0) {
      return NextResponse.json(
        { error: "Invoice not found or no matching child record" },
        { status: 404 }
      );
    }

    const outboundChildPaymentRef = invoiceRows[0].outbound_child_payment_ref;
    const paymentIdempotencyId = uuidv4();
    const applicationKey = process.env.YAPILY_APPLICATION_ID;
    const applicationSecret = process.env.YAPILY_APPLICATION_SECRET;
    const encodedCredentials = Buffer.from(`${applicationKey}:${applicationSecret}`).toString("base64");

    if (!outboundChildPaymentRef) {
      return NextResponse.json(
        { error: "Outbound child payment reference not found" },
        { status: 404 }
      );
    }

    const payload = {
      applicationUserId: applicationKey,
      institutionId,
      callback: "https://koja-web-mvp-v2-git-still-tryin-9ccb1b-andrew-osgerbys-projects.vercel.app",
      paymentRequest: {
        type: "DOMESTIC_PAYMENT",
        reference: `Payment-${outboundChildPaymentRef}`.substring(0, 18),
        paymentIdempotencyId: paymentIdempotencyId.substring(0, 35),
        amount: {
          amount,
          currency: "GBP",
        },
        payee: {
          name: "Recipient Name",
          accountIdentifications: [
            { type: "ACCOUNT_NUMBER", identification: "12345678" },
            { type: "SORT_CODE", identification: "123456" },
          ],
        },
      },
    };

    const response = await fetch("https://api.yapily.com/payment-auth-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify(payload),
    });
    
    console.log("Headers:", {
      "Content-Type": "application/json",
      Authorization: `Basic ${encodedCredentials}`,
    });
    console.log("Payload:", JSON.stringify(payload, null, 2));

    if (!response.ok) {
      const error = await response.json();
      console.error("Yapily API error:", error);
      return NextResponse.json({ error: "Failed to authorize", details: error }, { status: response.status });
    }

    const data = await response.json();
    const authorisationUrl = data?.data?.authorisationUrl;

    if (!authorisationUrl) {
      return NextResponse.json(
        { error: "Authorisation URL not returned from Yapily API" },
        { status: 500 }
      );
    }

    return NextResponse.json({ authorisationUrl });
  } catch (error) {
    console.error("Error in payment request handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
