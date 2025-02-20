import { Suspense } from "react";
import PayInvoiceClient from "app/ui/invoices/payinvoiceclient";
import { auth } from "@/auth";

export default async function PayInvoicePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  // Await searchParams before passing to the client-side component
  const session = await auth();
  const userEmail = session?.user?.email ?? "";
  const resolvedParams = await searchParams;

  return (
    <PayInvoiceClient searchParams={resolvedParams} userEmail={userEmail} />
  );
}
