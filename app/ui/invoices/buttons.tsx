import { PencilIcon, PlusIcon, TrashIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-[#F76C6C] px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function AddChild() {
  return (
    <Link
      href="/dashboard/add-child"
      className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Child</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href="/dashboard/invoices"
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function PayInvoice({
  id,
  name,
  amount,
  date,
}: {
  id: string;
  name: string;
  amount: number;
  date: string;
}) {
  console.log("PayInvoice Props:", { id, name, amount, date }); // Debugging

  return (
    <Link
      className="rounded-md border p-2 hover:bg-green-600 hover:text-white"
      href={{
        pathname: '/dashboard/invoices/pay',
        query: {
          id,
          name,
          amount,
          date: encodeURIComponent(date), // Ensure the date is URL-safe
        },
      }}
    >
      Pay invoice
    </Link>
  );
  
}

export function DeleteInvoice({ id }: { id: string }) {
  return (
    <>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
  );
}

export function AddFunds({ amount }: { amount: number }) {
  console.log("AddFunds Props:", { amount }); // Debugging

  return (
    <Link
      className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700"
      href={{
        pathname: '/dashboard/invoices/pay/add-funds',
        query: {
          amount,
        },
      }}
    >
      Add funds
    </Link>
  );
}