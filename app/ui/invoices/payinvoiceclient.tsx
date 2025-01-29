'use client';

import { useState } from 'react';
import { formatDateToLocal } from '@/app/lib/utils';
import { montserrat } from '@/app/ui/fonts';
import { AddFunds } from '@/app/ui/invoices/buttons';

export default function PayInvoiceClient({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Extract and process values safely
  const id = searchParams.id ?? null;
  const name = searchParams.name ?? null;
  const amount = searchParams.amount ? parseFloat(searchParams.amount) : 0; // Ensure a number
  const rawDate = searchParams.date ?? null;
  const date = rawDate ? decodeURIComponent(rawDate) : null;

  // Debugging log
  console.log("Inside PayInvoiceClient:", { id, name, amount, date });

  const [hmrcData, setHmrcData] = useState<any | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentReference?: string;
    correlationId?: string;
    estimatedPaymentDate?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const handleCheckBalance = async () => {
    if (!id) {
      console.error('Invoice ID is required.');
      return;
    }

    try {
      const response = await fetch('/api/dashboard/invoices/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkBalance', invoiceId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error checking balance:', errorData);
        setError(errorData.error || 'Error checking balance');
        return;
      }

      const data = await response.json();
      setHmrcData(data);
      setError(null);
    } catch (error) {
      console.error('Unexpected error during balance check:', error);
      setError('Failed to check balance. Please try again.');
    }
  };

  const handlePayTFC = async () => {
    if (!id) {
      console.error('Invoice ID is required.');
      return;
    }

    try {
      const response = await fetch('/api/dashboard/invoices/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'payInvoice', invoiceId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error processing payment:', errorData);
        setError(errorData.error || 'Error processing payment');
        return;
      }

      const data = await response.json();
      setError(null);

      if (data.success && data.paymentResponse) {
        const { payment_reference, correlation_id, estimated_payment_date } = data.paymentResponse;
        setPaymentDetails({
          paymentReference: payment_reference,
          correlationId: correlation_id,
          estimatedPaymentDate: estimated_payment_date,
        });
      }

      alert('Payment successful!');
    } catch (error) {
      console.error('Unexpected error during payment:', error);
      setError('Payment failed. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className={`${montserrat.className} text-2xl font-semibold`}>Pay Invoice</h1>
        <p className="text-sm text-gray-500">
          Would you like to pay this invoice now? Click the button to check your account balances
          and if you have enough cleared funds available, you can set up your payment to your
          childcare provider now. Otherwise, you can set up a payment from your bank.
        </p>
      </header>

      {/* Invoice Details Section */}
      <section className="mb-6 bg-white p-4 rounded-lg shadow-md w-auto">
        <h2 className="text-xl font-medium mb-4">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><p><strong>Name:</strong></p></div> <div><p>{name}</p></div>
          <div><p><strong>Amount:</strong></p></div> <div><p>£{amount}</p></div>
          <div><p><strong>Payment Due By:</strong></p></div> 
          <div><p>{date ? formatDateToLocal(date) : 'No due date provided'}</p></div>
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
        <section className="mb-6 bg-white p-4 rounded-lg shadow-md w-auto">
          <h2 className="text-xl font-medium mb-4">HMRC Account Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p><strong>Account Status:</strong></p></div> <div><p>{hmrcData.tfc_account_status}</p></div>
            <div><p><strong>Government Top-Up:</strong></p></div> <div><p>£{hmrcData.government_top_up / 100}</p></div>
            <div><p><strong>Top-Up Allowance:</strong></p></div> <div><p>£{hmrcData.top_up_allowance / 100}</p></div>
            <div><p><strong>Paid In By You:</strong></p></div> <div><p>£{hmrcData.paid_in_by_you / 100}</p></div>
            <div><p><strong>Total Balance:</strong></p></div> <div><p>£{hmrcData.total_balance / 100}</p></div>
            <div><p><strong>Cleared Funds:</strong></p></div> <div><p>£{hmrcData.cleared_funds / 100}</p></div>
          </div>

          {hmrcData.cleared_funds / 100 >= amount ? (
            <button
              onClick={handlePayTFC}
              className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700"
            >
              Pay with TFC funds
            </button>
          ) : (
            <>
              <div className="mt-8 mb-4">
                <p>You currently have insufficient funds in your Tax-Free Childcare account.</p>
              </div>
              <AddFunds amount={amount} invoiceId={id || ''} />
            </>
          )}
        </section>
      )}

      {/* Payment Details Section */}
      {paymentDetails.paymentReference && (
        <section className="mb-6 bg-white p-4 rounded-lg shadow-md w-auto">
          <h2 className="text-xl font-medium mb-4">Payment Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p><strong>Payment Reference:</strong></p></div> <div><p>{paymentDetails.paymentReference}</p></div>
            <div><p><strong>Estimated Payment Date:</strong></p></div> 
            <div><p>{paymentDetails.estimatedPaymentDate ? formatDateToLocal(paymentDetails.estimatedPaymentDate) : 'No due date provided'}</p></div>
          </div>
        </section>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}
    </div>
  );
}
