"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar";
import { Analytics } from "@vercel/analytics/react";

const NavbarWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <>
      {pathname.startsWith("/admin") ? (
        <>
            {children}
        </>
      ) : (
        <>
          <Navbar />
          <main className="px-4 pt-8 pb-20 md:px-6 md:pt-24 md:pb-6">
            {children}
            <Analytics />
          </main>
        </>
      )}
    </>
  );
};

export default NavbarWrapper;
