'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image'

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Add Funds</h1>

      {/* Loading and Error Handling */}
      {loading && <p>Loading institutions...</p>}
      {error && <p className="text-red-500">There was an error fetching institutions.</p>}

      {/* Institutions List */}
      {!loading && !error && meta?.count > 0 ? (
        <ul className="list-disc list-inside bg-white p-4 rounded shadow">
          {institutions.map((institution: any) => (
            <li key={institution.id}>
                <Image
      src="{institution.image}"
      width={500}
      height={500}
      alt="Picture of the author"
    />
              <p className="font-medium">{institution.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No institutions available.</p>
      )}
    </div>
  );
}
