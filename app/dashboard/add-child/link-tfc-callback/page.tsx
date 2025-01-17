'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LinkTfcCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code'); // Authorization code from HMRC
    const state = params.get('state'); // This is the childId

    if (!code || !state) {
      alert('Authorization failed or missing parameters.');
      router.push('/dashboard/add-child'); // Redirect back to the add child page
      return;
    }

    // Send code and state (childId) to the token exchange API
    fetch('/api/dashboard/add-child/store-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, childId: state }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          console.error('Token exchange failed:', error);
          alert(`Failed to link TFC account: ${error.error || 'Unknown error'}`);
        } else {
          alert('TFC account linked successfully!');
          router.push('/dashboard'); // Redirect to dashboard on success
        }
      })
      .catch((err) => {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred.');
      });
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Processing Authorization...</h1>
      <p>Please wait while we complete the linking process.</p>
    </div>
  );
}
