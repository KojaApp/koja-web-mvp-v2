import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { KojaVerificationEmail } from '@/email-templates/verification';
import { KojaPaymentEmail } from '@/email-templates/payment-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, firstName, paymentReference, paymentDate, type, extraData } = await req.json();

    if (!to || !firstName || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let emailTemplate;
    let subject;

    // ✅ Dynamically select the correct email template
    switch (type) {
      case 'registration':
        emailTemplate = KojaVerificationEmail({ firstName });
        subject = 'Thanks for registering!';
        break;
      case 'payment':
        emailTemplate = KojaPaymentEmail({ firstName, paymentReference, paymentDate  });
        subject = 'Your payment has been created';
        break;
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Koja <onboarding@dev.trykoja.com>',
      to,
      subject,
      react: emailTemplate,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
