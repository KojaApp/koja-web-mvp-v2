"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CurrencyPoundIcon,
  ReceiptPercentIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  // { name: 'Payments', href: '/dashboard/payments', icon: CurrencyPoundIcon },
  {
    name: "Details",
    href: "/dashboard/details",
    icon: DocumentMagnifyingGlassIcon,
  },
  { name: "KojaClub", href: "/dashboard/club", icon: ReceiptPercentIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] border-solid border-white grow items-center justify-center gap-2 rounded-md bg-[#0A2540] p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-white text-[#0A2540]": pathname === link.href, // Active state
                "text-white": pathname !== link.href, // Inactive state text color
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
