import PayInvoiceClient from "@/app/ui/invoices/payinvoiceclient";
import { auth } from "@/auth";

export default async function PayInvoicePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  // ✅ Move async logic here (Server Component)
  const session = await auth();
  const userEmail = session?.user?.email ?? ""; // Ensure it's always a string
  const resolvedParams = await searchParams; // Await searchParams before passing

  return (
    <PayInvoiceClient searchParams={resolvedParams} userEmail={userEmail} />
  );
}
