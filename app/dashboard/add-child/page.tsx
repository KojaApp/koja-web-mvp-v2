//import Form from '@/app/ui/invoices/create-form';//
import AddChildFormCopy from '@/app/ui/add-child/add-child-form-copy';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
//import { fetchCustomers } from '@/app/lib/data';//
// import { fetchChildren } from '@/app/lib/data';
 
//export default async function Page() { //
  // const customers = await fetchCustomers(); //

  export default async function Page() { 
  // const children = await fetchChildren(); 
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Children', href: '/dashboard' },
          {
            label: 'Add Child',
            href: '/dashboard/add-child',
            active: true,
          },
        ]}
      />
      <AddChildFormCopy />
    </main>
  );
}