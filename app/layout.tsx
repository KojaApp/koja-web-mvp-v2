import "@/app/ui/global.css";
import { opensans } from "@/app/ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${opensans.className} antialiased`}>{children}</body>
    </html>
  );
}
