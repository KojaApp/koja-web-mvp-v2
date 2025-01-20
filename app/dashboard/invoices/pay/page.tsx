'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDateToLocal } from '@/app/lib/utils';
import { montserrat } from '@/app/ui/fonts';

export default function PayInvoicePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const amount = parseFloat(searchParams.get('amount') || '0'); // Ensure amount is a number
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <header className="mb-6">
        <h1 className={`${montserrat.className} text-2xl font-semibold`}>Pay Invoice</h1>
        <p className="text-sm text-gray-500">Would you like to pay this invoice now? 
          Click the button to check your account balances and if you have enough cleared funds available to pay 
          the invoice, you can set up your payment to your childcare provider right now. If not, you can set up a payment directly from your back account, right here.</p>
      </header>

      {/* Invoice Details Section */}
      <section className="mb-6 bg-white p-4 rounded-lg shadow-md w-1/2">
        <h2 className="text-xl font-medium mb-4">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4"> 
          <div><p><strong>Name:</strong> </p></div> <div><p>{name}</p></div>
          <div><p><strong>Amount:</strong> </p></div> <div><p>£{amount}</p></div>
          <div><p><strong>Payment Due By:</strong> </p></div> <div><p>{formatDateToLocal(date)}</p></div>
        </div> 
      </section>

      {/* Actions Section */}
      <section className="flex justify-normal mb-6">
        <button
          onClick={handleCheckBalance}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        >
          Check TFC account balance
        </button>
      </section>

      {/* HMRC Account Data Section */}
      {hmrcData && (
        <section className="mb-6 bg-white p-4 rounded-lg shadow-md w-1/2">
          <h2 className="text-xl font-medium mb-4">HMRC Account Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p><strong>Account Status:</strong></p></div> <div><p>{hmrcData.tfc_account_status}</p></div>
            <div><p><strong>Government Top-Up:</strong></p></div> <div><p>£{hmrcData.government_top_up / 100}</p></div>
            <div><p><strong>Top-Up Allowance:</strong></p></div> <div><p> £{hmrcData.top_up_allowance / 100}</p></div>
            <div><p><strong>Paid In By You:</strong></p></div> <div><p> £{hmrcData.paid_in_by_you / 100}</p></div>
            <div><p><strong>Total Balance:</strong></p></div> <div><p> £{hmrcData.total_balance / 100}</p></div>
            <div><p><strong>Cleared Funds:</strong></p></div> <div><p> £{hmrcData.cleared_funds / 100}</p></div>
          </div>

{/* Conditional Button */}
{hmrcData.cleared_funds / 100 > amount ? (
  <button className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700">
    Pay with TFC funds
  </button>
) : (
  <><div className="mt-8"><p>You currently have insufficient funds in your Tax Free Childcare account to pay this invoice.</p></div>
  
  <button className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-gray-700">
                Add funds
              </button></>
)}
        </section>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}      
    </div>
  );
}
