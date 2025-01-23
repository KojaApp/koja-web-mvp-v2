import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { invoiceId, amount, institutionId } = await req.json();

    if (!invoiceId || !amount || !institutionId) {
      return NextResponse.json(
        { error: "Missing required fields: invoiceId, amount, or institutionId" },
        { status: 400 }
      );
    }

    // Retrieve outbound_child_payment_ref from the database
    const { rows: invoiceRows } = await sql`
      SELECT c.outbound_child_payment_ref
      FROM invoices i
      INNER JOIN children c ON i.child_id = c.id
      WHERE i.id = ${invoiceId}
    `;

    if (invoiceRows.length === 0) {
      return NextResponse.json(
        { error: "Invoice not found or no matching child record" },
        { status: 404 }
      );
    }

    const outboundChildPaymentRef = invoiceRows[0].outbound_child_payment_ref;

    if (!outboundChildPaymentRef) {
      return NextResponse.json(
        { error: "Outbound child payment reference not found" },
        { status: 404 }
      );
    }

    // Construct the payload for the Yapily API
    const payload = {
      applicationUserId: outboundChildPaymentRef,
      institutionId,
      callback: "https://your-callback-url.com/", // Replace with your actual callback URL
      paymentRequest: {
        type: "DOMESTIC_PAYMENT",
        reference: `Payment-${outboundChildPaymentRef}`,
        paymentIdempotencyId: `payment-${Date.now()}`,
        amount: {
          amount,
          currency: "GBP", // Assuming GBP as the currency
        },
        payee: {
          name: "Recipient Name", // Replace with recipient's name dynamically if needed
          accountIdentifications: [
            { type: "ACCOUNT_NUMBER", identification: "12345678" }, // Replace dynamically if needed
            { type: "SORT_CODE", identification: "12-34-56" }, // Replace dynamically if needed
          ],
        },
      },
    };

    const APPLICATION_KEY = process.env.YAPILY_APPLICATION_ID;
    const APPLICATION_SECRET = process.env.YAPILY_APPLICATION_SECRET;

    // Make the Yapily API request
    const response = await fetch("https://api.yapily.com/payment-auth-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from("APPLICATION_KEY:APPLICATION_SECRET").toString(
          "base64"
        )}`, // Replace with your actual Yapily credentials
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Yapily API error:", error);
      return NextResponse.json({ error: "Failed to create payment authorization" }, { status: 500 });
    }

    const data = await response.json();
    const authorisationUrl = data.data.authorisationUrl;

    if (!authorisationUrl) {
      return NextResponse.json(
        { error: "Authorisation URL not returned from Yapily API" },
        { status: 500 }
      );
    }

    // Return the authorisation URL
    return NextResponse.json({ authorisationUrl });
  } catch (error) {
    console.error("Error in payment request handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
