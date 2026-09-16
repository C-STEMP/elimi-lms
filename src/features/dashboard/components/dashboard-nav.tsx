"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { Logo } from "@/shared/components/ui/logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { useLogout } from "@/features/auth/hooks";
import { useOnboarding } from "@/features/onboarding/hooks";

const navLinkClass =
  "px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap";

export const DashboardNav: React.FC = () => {
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: onboarding } = useOnboarding("learner");

  const firstName = onboarding?.data?.personalDetails?.firstName;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  return (
    <header className="bg-primary-solid px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl xl:max-w-360 mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-6">
          <Logo href="/dashboard" width={100} />
          <nav className="hidden sm:flex items-center gap-1 bg-white/10 rounded-full p-1">
            <span className={`${navLinkClass} bg-white text-primary-solid`}>Overview</span>
            <a href="#recommended-courses" className={`${navLinkClass} text-white hover:bg-white/10`}>
              Courses
            </a>
            <Link href="/settings" className={`${navLinkClass} text-white hover:bg-white/10`}>
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Search"
            className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <FiSearch className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <FiBell className="w-4 h-4" />
          </button>
          <Avatar name={firstName} size={36} />
          <button
            type="button"
            aria-label="Log out"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
