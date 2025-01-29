import { Suspense } from 'react';
import PayInvoiceClient from 'app/ui/invoices/payinvoiceclient';

export default async function PayInvoicePage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  // Ensure the searchParams are awaited (if async data is being fetched)
  const resolvedParams = await searchParams;

  // Now, we pass the resolvedParams to the client-side component
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PayInvoiceClient searchParams={resolvedParams} />
    </Suspense>
  );
}
