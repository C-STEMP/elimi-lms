"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "antd";
import { LuPanelRight, LuLogOut, LuX } from "react-icons/lu";
import { useAdminSidebarContext } from "../context/admin-sidebar-context";
import { ADMIN_NAV_ITEMS } from "../constants/nav-items";
import { useLogout } from "@/features/auth/hooks";
import type { AdminSidebarProps } from "../types";

const sideBarStyle: React.CSSProperties = {
  overflowY: "auto",
  position: "fixed",
  height: "100vh",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  left: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
  zIndex: 40,
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed: externalCollapsed,
  onToggleCollapse: externalToggle,
  className = "",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const ctx = useAdminSidebarContext();
  const { mutate: logout, isPending } = useLogout();

  const isCollapsed =
    externalCollapsed !== undefined ? externalCollapsed : ctx.isCollapsed;
  const toggleCollapse = externalToggle ?? ctx.toggleCollapse;
  const isMobileOpen = ctx.isMobileOpen;
  const closeMobile = ctx.closeMobile;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  const isItemActive = (href: string, exact?: boolean) => {
    if (exact || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        style={sideBarStyle}
        className={`group py-2 space-y-4 hidden md:flex flex-col justify-between bg-primary rounded-r-2xl duration-300! transition-all! divide-y! divide-white/20! select-none ${
          isCollapsed ? "w-12" : "w-48"
        } ${className}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between md:gap-4 w-full h-13 relative px-0.5">
          <Link
            href="/admin"
            className={`${
              isCollapsed ? "group-hover:hidden" : "block"
            } h-12 relative shrink-0 flex items-center p-2`}
          >
            {isCollapsed ? (
              <Image
                src="/elimi-favicon.svg"
                alt="Elimi"
                className="object-contain group-hover:hidden"
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
                priority
              />
            ) : (
              <Image
                src="/elimi-logo-white.svg"
                alt="Elimi"
                className="object-contain"
                width={70}
                height={24}
                style={{ width: "auto", height: "auto" }}
                priority
              />
            )}
          </Link>
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`${
              isCollapsed ? "opacity-0 group-hover:opacity-100 pl-2" : "opacity-100 pr-2"
            } duration-300! transition-all! h-8 w-8 text-xs text-white cursor-pointer grid place-items-center`}
          >
            <LuPanelRight size={18} />
          </button>
        </div>

        {/* Navigation Items and Bottom Logout */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            {ADMIN_NAV_ITEMS.map((nav) => {
              const active = isItemActive(nav.href, nav.exact);
              const Icon = nav.icon;
              return (
                <Tooltip
                  key={nav.href}
                  title={nav.label}
                  trigger={["hover"]}
                  placement="right"
                >
                  <Link
                    href={nav.href}
                    className={`${
                      isCollapsed ? "w-12" : "w-48"
                    } overflow-x-hidden flex items-center gap-4 p-3 text-white! text-sm md:text-base border-l-4! ${
                      active
                        ? "bg-white/30! border-secondary!"
                        : "border-transparent!"
                    } hover:bg-white/30 hover:border-secondary! transition-colors`}
                  >
                    <span className="shrink-0 -translate-x-0.5">
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                    </span>
                    <p
                      className={`${
                        isCollapsed ? "hidden" : "visible"
                      } text-sm -tracking-tight whitespace-nowrap`}
                    >
                      {nav.label}
                    </p>
                  </Link>
                </Tooltip>
              );
            })}
          </div>

          <div className="relative pt-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className={`${
                isCollapsed ? "w-12" : "w-48"
              } overflow-x-hidden flex items-center gap-4 p-3 text-white! text-sm md:text-base hover:bg-white/30 border-l-4! border-transparent! hover:border-white/60! transition-colors cursor-pointer w-full text-left disabled:opacity-50`}
            >
              <span className="shrink-0 -translate-x-0.5">
                <LuLogOut size={18} />
              </span>
              <p
                className={`${
                  isCollapsed ? "hidden" : "visible"
                } text-sm -tracking-tight whitespace-nowrap`}
              >
                {isPending ? "Logging out..." : "Logout"}
              </p>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav
        className={`${
          isMobileOpen ? "flex md:hidden" : "hidden md:hidden"
        } flex-col bg-primary p-4 z-50 fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-y-auto`}
      >
        <div className="flex justify-between items-center gap-4 pb-4 mb-2 border-b! border-white/20!">
          <div className="flex md:hidden items-center gap-2">
            <Image
              src="/elimi-logo-white.svg"
              alt="Elimi"
              className="object-contain"
              width={70}
              height={24}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation"
            className="grid place-items-center p-1 rounded-lg text-white text-xs h-8 w-8 sm:h-10 sm:w-10 shrink-0 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            {ADMIN_NAV_ITEMS.map((nav) => {
              const active = isItemActive(nav.href, nav.exact);
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  onClick={closeMobile}
                  className={`overflow-x-hidden flex items-center gap-3 -translate-x-3 px-3 py-2.5 text-white! text-sm md:text-base ${
                    active
                      ? "bg-white/30! border-secondary!"
                      : "border-transparent!"
                  } hover:bg-white/30 border-l-4! hover:border-secondary! transition-colors`}
                >
                  <span className="shrink-0 scale-75">
                    <Icon className="w-5 h-5 shrink-0" />
                  </span>
                  <p className="text-white text-xs sm:text-sm -tracking-tight whitespace-nowrap">
                    {nav.label}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="relative pt-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="overflow-x-hidden flex items-center gap-3 -translate-x-3 px-3 py-2.5 text-white! text-xs sm:text-sm hover:bg-white/30 border-l-4! border-transparent! hover:border-white/60! cursor-pointer w-full text-left transition-colors disabled:opacity-50"
            >
              <span className="shrink-0 scale-75">
                <LuLogOut size={18} />
              </span>
              <p className="text-xs sm:text-sm -tracking-tight whitespace-nowrap">
                {isPending ? "Logging out..." : "Logout"}
              </p>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
