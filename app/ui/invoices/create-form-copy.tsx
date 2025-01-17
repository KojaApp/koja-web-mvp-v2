'use client';

import { CustomerField, ChildField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CurrencyPoundIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { addInvoice } from '@/app/lib/actions';

export default function AddInvoiceForm({ children, ...props } : any) {
  const [errorMessage, formAction] = useActionState(addInvoice, null);

  return (
    <form action={formAction} className="space-y-3">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        
{/* Child Name */}
        <div className="mb-4">
          <label htmlFor="child" className="mb-2 block text-sm font-medium">
            Choose child
          </label>
          <select
  id="child"
  name="childId"
  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  defaultValue=""
  onChange={(e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const childNameInput = document.getElementById("childName");
    if (childNameInput) {
      childNameInput.value = selectedOption.text;
    }
  }}
>
  <option value="" disabled>Select a child</option>
  {children.map((child: any) => (
    <option key={child.child_id} value={child.child_id}>
      {child.child_name}
    </option>
  ))}
</select>
<input
  type="hidden"
  id="childName"
  name="childName"
  value=""
/>
</div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="Enter GBP amount"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder-gray-500"
          />
        </div>

        {/* Invoice Due Date */}
        <div className="mb-4">
          <label htmlFor="dueDate" className="mb-2 block text-sm font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="Date"
            placeholder="Enter due date for invoice"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder-gray-500"
          />
        </div>

        {/* Invoice Status */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">Invoice Status</legend>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                id="pending"
                name="status"
                type="radio"
                value="pending"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
              />
              <label
                htmlFor="pending"
                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
              >
                Pending <ClockIcon className="h-4 w-4" />
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="paid"
                name="status"
                type="radio"
                value="paid"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
              />
              <label
                htmlFor="paid"
                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
              >
                Paid <CheckIcon className="h-4 w-4" />
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
