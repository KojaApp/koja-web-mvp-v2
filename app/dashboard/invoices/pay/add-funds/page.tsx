'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'

export default function AddFundsPage() {
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get('amount') || '0');

  const [institutions, setInstitutions] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ count: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(`/api/dashboard/invoices/pay/add-funds?amount=${amount}`);
      const responseData = await response.json();

      if (response.ok) {
        const institutionsData = responseData.institutions?.data || [];
        setInstitutions(institutionsData);
        setMeta(responseData.institutions?.meta || { count: 0 });
      } else {
        console.error('API Error:', responseData.error);
        setError(true);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentRequest = async (institutionId: string) => {
    const invoiceId = searchParams.get('invoiceId');
    if (!invoiceId) {
      alert('Invoice ID is missing from the URL.');
      return;
    }

    try {
      const response = await fetch('/api/dashboard/invoices/pay/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId,
          amount,
          institutionId,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        const { authorisationUrl } = result;
        window.location.href = authorisationUrl;
      } else {
        alert(`Error: ${result.error.message}`);
      }
    } catch (error) {
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Add Funds</h1>
      <p className="mb-4">Select your bank from the list below to set up your payment.</p>

      {loading && <p>Loading institutions...</p>}
      {error && <p className="text-red-500">There was an error fetching institutions.</p>}

      {!loading && !error && meta?.count !== undefined && meta.count > 0 ? (
        <ul className="list-none bg-white p-4 rounded shadow divide-y divide-gray-200">
          {institutions.map((institution: any) => {
            const logo = institution.media?.find((item: any) => item.type === 'logo')?.source;
            return (
              <li key={institution.id} className="py-4 flex items-center space-x-4">
                {logo && <img src={logo} alt={`${institution.name} logo`} className="w-10 h-auto rounded" />}
                <div>
                  <button
                    onClick={() => handlePaymentRequest(institution.id)}
                    aria-label={`Initiate payment for ${institution.name}`}
                    className="text-blue-500 hover:underline"
                  >
                    <p className="font-medium">{institution.name}</p>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        !loading && !error && <p>No institutions available.</p>
      )}
    </div>
  );
}
