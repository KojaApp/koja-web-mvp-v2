import { fetchInvoicesForUser } from '@/app/lib/data';
import { filterInvoices } from '@/app/lib/data';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice, PayInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchInvoicesForUser(currentPage);

  // Filter invoices based on the search query
  const filteredInvoices = filterInvoices(invoices, query);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {filteredInvoices?.map((invoice) => (
              <div
                key={invoice.invoice_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p>{invoice.name}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.due_date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <PayInvoice id={invoice.invoice_id} name={invoice.name} amount={invoice.amount} date={invoice.due_date} />
                    <UpdateInvoice id={invoice.invoice_id} />
                    <DeleteInvoice id={invoice.invoice_id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Child</th>
                <th scope="col" className="px-3 py-5 font-medium">Amount</th>
                <th scope="col" className="px-3 py-5 font-medium">Due Date</th>
                <th scope="col" className="px-3 py-5 font-medium">Status</th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredInvoices?.map((invoice) => (
                <tr key={invoice.invoice_id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{invoice.child_name}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(invoice.amount)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(invoice.due_date)}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <PayInvoice id={invoice.invoice_id} name={invoice.name} amount={invoice.amount} date={formatDateToLocal(invoice.due_date)} />
                      <UpdateInvoice id={invoice.invoice_id} />
                      <DeleteInvoice id={invoice.invoice_id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
