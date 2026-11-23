"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiBell, FiCheck, FiLogOut, FiMenu, FiX, FiChevronLeft, FiBookOpen } from "react-icons/fi";
import { Logo } from "@/shared/components/ui/logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { LogoutModal } from "@/shared/components/ui/logout-modal";
import { useLogout } from "@/features/auth/hooks";
import { useOnboarding } from "@/features/onboarding/hooks";
import { useMeProfile } from "@/features/me/hooks";
import {
  useMarkAllRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "@/features/notifications/hooks";
import { tokenStorage } from "@/shared/lib/token-storage";

const navLinkClass =
  "px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/courses", label: "Courses" },
  { href: "/certificates", label: "Certificates" },
  { href: "/settings", label: "Settings" },
];

export interface DashboardNavProps {
  /** Overrides the default "Welcome Back, {firstName}" title. */
  title?: string;
  /** Switches the bottom row to a back-chevron + title, e.g. for detail pages. */
  backHref?: string;
  backTitle?: string;
  /** Replaces the default "Browse Courses" CTA on the bottom row; pass `null` to hide it. */
  rightAction?: React.ReactNode | null;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  title,
  backHref,
  backTitle,
  rightAction,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const hasUser = useSyncExternalStore(
    () => () => {},
    () => Boolean(tokenStorage.getUser()),
    () => false
  );

  const { data: onboarding } = useOnboarding("learner", hasUser);
  const { data: profile } = useMeProfile(hasUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useUnreadCount(hasUser ? "lms" : "");
  const { data: notificationsRes, isLoading: isLoadingNotifications } = useNotifications({
    platform: "lms",
    limit: 10,
  });
  const { mutate: markRead } = useMarkNotificationRead("lms");
  const { mutate: markAllRead, isPending: isMarkingAllRead } = useMarkAllRead("lms");

  const unreadCount = unreadData?.count ?? 0;
  const notifications = notificationsRes?.data ?? [];

  useEffect(() => {
    if (!isNotificationsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  const firstName =
    profile?.personalDetails?.firstName ||
    onboarding?.data?.personalDetails?.firstName;
  const avatarUrl = profile?.photo?.url;

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  const isLinkActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const defaultRightAction = (
    <Link
      href="/courses"
      className="bg-secondary hover:bg-secondary-hover active:scale-95 text-white font-semibold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 select-none"
    >
      <span>Browse Courses</span>
      <FiBookOpen className="w-4 h-4" />
    </Link>
  );

  return (
    <header className="w-full bg-primary-solid text-white shadow-md relative">
      <div className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <Logo href="/dashboard" width={90} />

          <nav className="hidden md:flex items-center gap-1 bg-white/10 rounded-full p-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${navLinkClass} ${
                  isLinkActive(link.href) ? "bg-white text-primary-solid" : "text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={notificationsRef} className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
                onClick={() => setIsNotificationsOpen((open) => !open)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer relative"
              >
                <FiBell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-text-dark rounded-2xl shadow-xl border border-border-gray/60 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border-gray/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-neutral-primary">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary-solid/10 text-primary-solid text-[11px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        disabled={isMarkingAllRead}
                        onClick={() => markAllRead()}
                        className="text-xs font-semibold text-primary-solid hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-border-gray/40">
                    {isLoadingNotifications ? (
                      <div className="p-4 text-xs text-neutral-secondary text-center">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center flex flex-col items-center gap-1">
                        <FiBell className="w-5 h-5 text-neutral-secondary/50" />
                        <p className="text-xs font-semibold text-neutral-primary">
                          You&apos;re all caught up
                        </p>
                        <p className="text-[11px] text-neutral-secondary">
                          Course updates and certificate alerts will show up here.
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isUnread = !n.readAt && n.status !== "read";
                        const payload = n.payload ?? {};
                        const titleText =
                          (typeof payload.title === "string" && payload.title) ||
                          (typeof payload.subject === "string" && payload.subject) ||
                          n.templateId?.replace(/[._-]+/g, " ") ||
                          "Notification";
                        const bodyText =
                          (typeof payload.message === "string" && payload.message) ||
                          (typeof payload.body === "string" && payload.body) ||
                          "";
                        return (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => {
                              if (isUnread) markRead(n.id);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-input-bg/60 transition-colors flex items-start gap-2.5 cursor-pointer ${
                              isUnread ? "bg-primary-solid/[0.03]" : ""
                            }`}
                          >
                            <span
                              className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                                isUnread ? "bg-secondary" : "bg-transparent"
                              }`}
                            />
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <span className="text-xs font-bold text-neutral-primary line-clamp-1 capitalize">
                                {titleText}
                              </span>
                              {bodyText && (
                                <span className="text-[11px] text-neutral-secondary line-clamp-2">
                                  {bodyText}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/settings"
              aria-label="Profile settings"
              className="relative shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <Avatar
                src={avatarUrl || undefined}
                name={firstName}
                size={36}
                className="border-2 border-white/30"
              />
            </Link>

            <button
              type="button"
              aria-label="Log out"
              title="Log out"
              onClick={() => setIsLogoutOpen(true)}
              className="hidden md:flex w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors cursor-pointer"
            >
              <FiLogOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex md:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex justify-end md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="relative w-full max-w-70 bg-primary-hover border-l border-white/10 text-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={avatarUrl || undefined}
                      name={firstName}
                      className="w-9 h-9 border border-white/30 shrink-0"
                    />
                    <span className="text-sm font-bold text-white truncate">
                      {firstName || "Learner"}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 pt-5">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center ${
                          isLinkActive(link.href)
                            ? "bg-white text-primary-solid shadow-sm"
                            : "text-white/85 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLogoutOpen(true);
                    }}
                    className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-200 hover:text-white hover:bg-red-500/20 flex items-center gap-2.5 text-left transition-all cursor-pointer w-full"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-5 gap-3 sm:gap-4 w-full">
          {backTitle ? (
            backHref ? (
              <Link
                href={backHref}
                className="flex items-center gap-1.5 sm:gap-2 text-white font-bold text-lg sm:text-2xl lg:text-3xl tracking-tight hover:opacity-90 transition-opacity wrap-break-word"
              >
                <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] shrink-0" />
                <span className="wrap-break-word">{backTitle}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-1.5 sm:gap-2 text-white font-bold text-lg sm:text-2xl lg:text-3xl tracking-tight hover:opacity-90 transition-opacity wrap-break-word cursor-pointer select-none"
              >
                <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] shrink-0" />
                <span className="wrap-break-word">{backTitle}</span>
              </button>
            )
          ) : (
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white wrap-break-word">
              {title || `Welcome Back, ${firstName || "there"}`}
            </h1>
          )}

          {rightAction === null ? null : (
            <div className="shrink-0 max-w-full self-start sm:self-auto">
              {rightAction ?? defaultRightAction}
            </div>
          )}
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </header>
  );
};
