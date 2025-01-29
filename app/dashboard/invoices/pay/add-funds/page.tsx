'use client';

import { Suspense } from 'react';
import AddFundsClient from 'app/ui/invoices/addfundsclient';

export default function AddFundsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AddFundsClient />
    </Suspense>
  );
}
