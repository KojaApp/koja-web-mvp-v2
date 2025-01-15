'use client';

import { useState } from 'react';
import { addChild } from '@/app/lib/actions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function AddChildFormCopy() {
  const [errorMessage, setErrorMessage] = useState<any | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [childId, setChildId] = useState<any | null>(null);  // State for childId

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    // Log form data for debugging
    console.log("Form Data:", Object.fromEntries(formData.entries()));

    setIsPending(true);
    try {
      // Call addChild directly
      const result = await addChild(null, formData); // Pass form data to addChild function

      if (result.success) {
        setIsSuccess(true);  // Show success if result is success
        setErrorMessage(null);
        setChildId(result.childId); // Store the childId here
      } else {
        setIsSuccess(false);
        setErrorMessage(result.error);  // Show error if result has error
      }
    } catch (error) {
      setIsPending(false);
      setIsSuccess(false);
      setErrorMessage("An unexpected error occurred.");
      console.error("Error:", error);
    }
    setIsPending(false); // End the pending state
  };

  // Function to handle TFC linking
  const handleLinkTfc = async () => {
    if (!childId) {
      console.error("Child ID is missing.");
      return;
    }

    // Trigger API to link TFC account only when childId exists
    try {
      const response = await fetch('/api/dashboard/add-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ childId }), // Send the childId in the request body
      });

      const result = await response.json();
      if (response.ok) {
        alert("TFC Account Linked Successfully");
      } else {
        alert(`Failed to link TFC Account: ${result.error}`);
      }
    } catch (error) {
      console.error("Error linking TFC account:", error);
      alert("An unexpected error occurred while linking the TFC account.");
    }
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
          <p>Child successfully added! You can now link the TFC account.</p>
          <Button onClick={handleLinkTfc}>Link TFC Account</Button>
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
          {isPending ? 'Submitting...' : 'Add Child'}
        </Button>
      </div>
    </form>
  );
}
