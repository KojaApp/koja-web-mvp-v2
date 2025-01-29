import { Suspense } from 'react';
import PayInvoiceClient from 'app/ui/invoices/payinvoiceclient';

export default function Page({ searchParams }: { searchParams: Record<string, string> }) {
  return <PayInvoiceClient searchParams={searchParams} />;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PayInvoiceClient searchParams={searchParams} />
    </Suspense>
  );
}
