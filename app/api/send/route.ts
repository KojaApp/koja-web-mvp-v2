import { KojaVerificationEmail } from '@/email-templates/verification';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Extract recipient email and name from request body
    const { to, firstName } = await req.json();

    if (!to || !firstName) {
      return NextResponse.json({ error: 'Missing email or first name' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Koja <onboarding@dev.trykoja.com>',
      to,
      subject: 'Verify your email',
      react: KojaVerificationEmail({ firstName }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
