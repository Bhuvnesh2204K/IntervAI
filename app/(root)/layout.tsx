import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/prepare" className="text-sm text-muted-foreground hover:text-primary-100 transition-colors">
            Prepare
          </Link>
          <Link href="/interview" className="text-sm text-muted-foreground hover:text-primary-100 transition-colors">
            Interviews
          </Link>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
