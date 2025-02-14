import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authCode = searchParams.get("code"); // Yapily returns this
    const state = searchParams.get("state"); // May contain your reference

    if (!authCode) {
      return NextResponse.json({ error: "Authorization code missing" }, { status: 400 });
    }

    // Exchange authCode for access token (if required) and finalize payment
    const applicationKey = process.env.YAPILY_APPLICATION_ID;
    const applicationSecret = process.env.YAPILY_APPLICATION_SECRET;
    const encodedCredentials = Buffer.from(`${applicationKey}:${applicationSecret}`).toString("base64");

    const response = await fetch("https://api.yapily.com/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify({
        authorisationCode: authCode, // Required to complete the payment
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: "Payment finalization failed", details: error }, { status: response.status });
    }

    const paymentResult = await response.json();
    return NextResponse.json({ success: true, paymentResult });
  } catch (error) {
    console.error("Error in Yapily callback handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
