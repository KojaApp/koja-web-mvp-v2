'use client';

import { useEffect, useState } from 'react';

export default function AddFundsPage() {
  const [institutions, setInstitutions] = useState<any[]>([]); // Store the fetched institutions
  const [searchTerm, setSearchTerm] = useState(''); // Store the search term
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track any error

  // Fetch institutions on page load
  useEffect(() => {
    const fetchInstitutions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/dashboard/invoices/pay/add-funds', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'getInstitutions' }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch institutions.');
        }

        const data = await response.json();
        setInstitutions(data.institutions || []); // Assuming API returns { institutions: [...] }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching institutions.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []); // Empty dependency array ensures this runs once on page load

  // Filter institutions based on search term
  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Add Funds</h1>
        <p className="text-sm text-gray-500">
          Select your institution to proceed with adding funds.
        </p>
      </header>

      {loading && <p>Loading institutions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Bar */}
      {!loading && !error && (
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search institutions..."
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {/* Institutions Table */}
      {!loading && !error && filteredInstitutions.length > 0 && (
        <table className="table-auto w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstitutions.map((institution) => (
              <tr key={institution.id} className="border-t">
                <td className="px-4 py-2">{institution.name}</td>
                <td className="px-4 py-2">{institution.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && filteredInstitutions.length === 0 && (
        <p>No institutions found.</p>
      )}
    </div>
  );
}
