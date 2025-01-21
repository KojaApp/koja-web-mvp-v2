'use client';

import { useSearchParams } from 'next/navigation';

export default function PayInvoiceForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const amount = searchParams.get('amount');

  return (
    <div>
      <h1>Pay Invoice</h1>
      <p>Invoice ID: {id}</p>
      <p>Name: {name}</p>
      <p>Amount: {amount}</p>
    </div>
  );
}
