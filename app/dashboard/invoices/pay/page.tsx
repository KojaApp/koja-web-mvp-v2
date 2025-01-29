import { Suspense } from 'react';
import PayInvoiceClient from 'app/ui/invoices/payinvoiceclient';

export default async function PayInvoicePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  // Await searchParams before passing to the client-side component
  const resolvedParams = await searchParams;

  return <PayInvoiceClient searchParams={resolvedParams} />;
}
