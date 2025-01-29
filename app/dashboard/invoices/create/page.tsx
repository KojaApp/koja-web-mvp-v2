import AddInvoiceForm from '@/app/ui/invoices/create-form-copy';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchChildren } from '@/app/lib/data';

// Force dynamic rendering to support session-based fetching
export const dynamic = "force-dynamic";

export default async function Page() {
  // Fetch children data dynamically
  const children = await fetchChildren();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true },
        ]}
      />
      {/* Pass children data to the AddInvoiceForm */}
      <AddInvoiceForm children={children} />
    </main>
  );
}
