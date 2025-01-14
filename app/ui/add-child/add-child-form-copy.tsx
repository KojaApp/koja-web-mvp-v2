'use client';

import { useState, useTransition } from 'react';
import { useActionState } from 'react';
import { addChild } from '@/app/lib/actions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function AddChildFormCopy() {
  const [errorMessage, formAction] = useActionState(addChild, null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition(); // Start a transition to handle async

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Log form data for debugging
    console.log("Form Data:", Object.fromEntries(formData.entries()));

    // Dispatch the action using startTransition to handle async
    startTransition(() => {
      formAction(formData).then((result) => {
        if (result) {
          setIsSuccess(true); // Set success to true if result is not empty
        } else {
          setIsSuccess(false); // Otherwise, set it to false
        }
      }).catch((error) => {
        setIsSuccess(false); // If an error occurs, set to false
        console.error("Error:", error);
      });
    });
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

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      {isSuccess && (
        <div className="text-green-600">
          <p>Child successfully added! You can now link the TFC account.</p>
          {/* Add the button to link TFC account */}
          <Button
            onClick={() => {
              // Handle TFC linking here (you can redirect or trigger some other action)
            }}
          >
            Link TFC Account
          </Button>
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
