import { Suspense } from 'react';
import PayInvoiceClient from 'app/ui/invoices/payinvoiceclient';

export default async function PayInvoicePage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  // Await searchParams directly
  const resolvedParams = await searchParams;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PayInvoiceClient searchParams={resolvedParams} />
    </Suspense>
  );
}
