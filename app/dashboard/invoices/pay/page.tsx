'use client';

import { useSearchParams } from 'next/navigation';
import { formatDateToLocal } from '@/app/lib/utils';

export default function PayInvoicePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const amount = searchParams.get('amount');
  const rawDate = searchParams.get('date');
  const date = rawDate ? decodeURIComponent(rawDate) : null;

  return (
    <div>
      <h1>Pay Invoice</h1>
      <p>Name: {name}</p>
      <p>Amount: {amount}</p>
      <p>Payment due by: {formatDateToLocal(date)}</p>
    </div>
  );
}
