'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDateToLocal } from '@/app/lib/utils';
import { montserrat } from '@/app/ui/fonts';

export default function PayInvoicePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const amount = searchParams.get('amount');
  const rawDate = searchParams.get('date');
  const date = rawDate ? decodeURIComponent(rawDate) : null;

  const [hmrcData, setHmrcData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckBalance = async () => {
    if (!id) return;

    try {
      const response = await fetch('/api/dashboard/invoices/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceId: id }), // Send invoiceId in the request body
      });

      const data = await response.json();

      if (response.ok) {
        setHmrcData(data); // Store the returned data
      } else {
        setError(data.error || 'Error checking balance');
      }
    } catch (err) {
      setError('Failed to check balance');
    }
  };

  return (
    <div>
      <h1 className={`${montserrat.className} text-2xl mb-4`}>Pay an Invoice</h1>
      <p>Name: {name}</p>
      <p>Amount: {amount}</p>
      <p>Payment due by: {formatDateToLocal(date)}</p>

      {error && <p className="text-red-500">{error}</p>}

      {hmrcData && (
  <div className="mt-4">
    <h2 className="text-xl font-semibold">HMRC Account Details</h2>
    <p>Total Balance: £{hmrcData.total_balance / 100}</p>
    <p>Cleared Funds: £{hmrcData.cleared_funds / 100}</p>
    <p>Paid In By You: £{hmrcData.paid_in_by_you / 100}</p>
    <p>Government Top-Up: £{hmrcData.government_top_up / 100}</p>
    <p>Top-Up Allowance remaining for this period: £{hmrcData.top_up_allowance / 100}</p>
    <p>Account Status: {hmrcData.tfc_account_status}</p>
    
    
  </div>
)}

      <button
        onClick={handleCheckBalance}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Check Tax Free Childcare balances
      </button>
    </div>
  );
}
