'use client';

import { useState } from 'react';
import { addChild } from '@/app/lib/actions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function AddChildForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [childId, setChildId] = useState<string | null>(null); // State for childId

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
  
    // Log the form data to check the values being passed
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    setIsPending(true);
try {
  const result = await addChild(null, formData); // Add child to the database

  if (result.success) {
    setIsSuccess(true);
    setErrorMessage(null); // Explicitly set to `null`
    setChildId(result.childId ?? null); // Convert `undefined` to `null`
  } else {
    setIsSuccess(false);
    setErrorMessage(result.error ?? null); // Convert `undefined` to `null`
  }
} catch (error) {
  setIsPending(false);
  setIsSuccess(false);
  setErrorMessage("An unexpected error occurred."); // This is already a string
  console.error("Error:", error);
}
setIsPending(false);
  };

  const handleHmrcRedirect = () => {
    if (!childId) {
      alert("Error: No child data available.");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_HMRC_CLIENT_ID; // Store in .env file
    const redirectUri = encodeURIComponent("http://localhost:3000/dashboard/add-child/link-tfc-callback");
    const scope = encodeURIComponent("tax-free-childcare-payments");
    const state = encodeURIComponent(childId); // Use the childId to maintain context
    const authorizationUrl = `https://test-api.service.hmrc.gov.uk/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    window.location.href = authorizationUrl; // Redirect to HMRC authorization URL
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Child Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter child's first name"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder-gray-500"
          />
        </div>

        {/* Child DOB */}
        <div className="mb-4">
          <label htmlFor="DOB" className="mb-2 block text-sm font-medium">
            Date of Birth
          </label>
          <input
            id="DOB"
            name="DOB"
            type="date"
            placeholder="Date of birth"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder-gray-500"
          />
        </div>

        {/* CCP Reference */}
        <div className="mb-4">
          <label htmlFor="ccp_ref" className="mb-2 block text-sm font-medium">
            Childcare Provider Reference
          </label>
          <input
            id="ccp_ref"
            name="ccp_ref"
            type="text"
            placeholder="Enter childcare provider reference"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder-gray-500"
          />
        </div>

        {/* CCP Postcode */}
        <div className="mb-4">
          <label htmlFor="ccp_pc" className="mb-2 block text-sm font-medium">
            Childcare Provider Postcode
          </label>
          <input
            id="ccp_pc"
            name="ccp_pc"
            type="text"
            placeholder="Enter childcare provider's postcode"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder-gray-500"
          />
        </div>

        {/* TFC Reference */}
        <div className="mb-4">
          <label htmlFor="TFC" className="mb-2 block text-sm font-medium">
            Tax-Free Childcare Reference
          </label>
          <input
            id="TFC"
            name="TFC"
            type="text"
            placeholder="Enter TFC account reference"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder-gray-500"
          />
        </div>
      </div>

      {/* Error message */}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      {/* Success message */}
      {isSuccess && (
        <div className="text-green-600">
          <p className="mb-4">Child successfully added.</p>
          <p></p>
          <div className="flex gap-4 items-end">
            <Button type="button" onClick={handleHmrcRedirect}>Link TFC Account</Button>
            <Link href="/dashboard" className="text-blue-600 underline">
              I will do this later
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/add-child"
          className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Child"}
        </Button>
      </div>
    </form>
  );
}
