//import Form from '@/app/ui/invoices/create-form';//
import AddInvoiceForm from '@/app/ui/invoices/create-form-copy';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
//import { fetchCustomers } from '@/app/lib/data';//
import { fetchChildren } from '@/app/lib/data';
//export default async function Page() { //
  // const customers = await fetchCustomers(); //

  export default async function Page() { 
  const children = await fetchChildren(); 
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <AddInvoiceForm children={children} />
    </main>
  );
}