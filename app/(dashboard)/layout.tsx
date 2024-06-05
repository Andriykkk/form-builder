import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { useUserStatus } from "@/actions/useUserStatus";

async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-w-full bg-background min-h-screen'>
      <nav className='flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
        <Logo />
        <div className='flex gap-4 items-center'>
          <ThemeSwitcher />
          <UserButton afterSignOutUrl='/sign-in' />
        </div>
      </nav>
      <main className='flex w-full flex-grow h-full'>
        {children}
      </main>
    </div>
  );
}

export default Layout;
