'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';

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
      console.log("API Response:", responseData); // Check full response structure

      if (response.ok) {
        // Ensure the data is correctly extracted from the response
        const institutionsData = responseData.institutions?.data || []; // Correctly access 'data'
        console.log("Institutions Data:", institutionsData); // Check if institutions data exists

        // Set state based on the fetched data
        setInstitutions(institutionsData);
        setMeta(responseData.institutions?.meta || { count: 0 });
      } else {
        console.error("API Error:", responseData.error);
        setError(true);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  console.log("Institutions State:", institutions); // Check institutions state before rendering

  const handlePaymentRequest = async (institutionId: string) => {
    const invoiceId = searchParams.get('invoiceId'); // Extract invoiceId from query params
    console.log('Extracted invoiceId:', invoiceId); // Debugging statement
  
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
          invoiceId, // Correctly include invoiceId
          amount,    // Pass amount if needed
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Payment request created successfully!');
        console.log('Payment request:', result.success);
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

      {/* Loading and Error Handling */}
      {loading && <p>Loading institutions...</p>}
      {error && <p className="text-red-500">There was an error fetching institutions.</p>}

      {/* Institutions List */}
      {!loading && !error && meta?.count > 0 ? (
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
      ) : (
        !loading && !error && <p>No institutions available.</p>
      )}
    </div>
  );
}
