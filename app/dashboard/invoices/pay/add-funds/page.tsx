'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function InstitutionsList({
  amount,
  handlePaymentRequest,
}: {
  amount: number;
  handlePaymentRequest: (institutionId: string) => void;
}) {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ count: number }>({ count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch institutions on mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(`/api/dashboard/invoices/pay/add-funds?amount=${amount}`);
        const responseData = await response.json();

        if (response.ok) {
          const institutionsData = responseData.institutions?.data || [];
          setInstitutions(institutionsData);
          setMeta(responseData.institutions?.meta || { count: 0 });
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, [amount]);

  if (loading) return <p>Loading institutions...</p>;
  if (error) return <p className="text-red-500">There was an error fetching institutions.</p>;

  if (meta.count === 0) return <p>No institutions are available</p>;

  return (
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
              >
                <p className="font-medium">{institution.name}</p>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function AddFundsPage() {
  const searchParams = useSearchParams();

  const amount = parseFloat(searchParams.get('amount') || '0');
  const invoiceId = searchParams.get('invoiceId');

  const handlePaymentRequest = async (institutionId: string) => {
    if (!invoiceId) {
      alert('Invoice ID is missing from the URL.');
      console.error('Invoice ID is missing from the URL.');
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
        alert('Payment request created successfully! Redirecting to bank...');
        console.log('Payment request:', result);
        window.location.href = authorisationUrl;
      } else {
        alert(`Error: ${result.error.message}`);
        console.error('API Error:', result.error);
      }
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error('Client Error:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Add Funds</h1>
      <p className="mb-4">Select your bank from the list below to set up your payment.</p>

      <Suspense fallback={<p>Loading institutions...</p>}>
        <InstitutionsList amount={amount} handlePaymentRequest={handlePaymentRequest} />
      </Suspense>
    </div>
  );
}
