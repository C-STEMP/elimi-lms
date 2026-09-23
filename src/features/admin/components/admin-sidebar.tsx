"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "antd";
import { LuPanelLeft, LuPanelRight, LuLogOut, LuX } from "react-icons/lu";
import { useAdminSidebarContext } from "../context/admin-sidebar-context";
import { ADMIN_NAV_ITEMS } from "../constants/nav-items";
import { AdminLogoMark } from "./admin-logo-mark";
import { useLogout } from "@/features/auth/hooks";
import type { AdminSidebarProps } from "../types";

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
      {/* Desktop Sidebar (Floating Card) */}
      <aside
        className={`bg-primary text-white rounded-2xl hidden md:flex flex-col justify-between shrink-0 my-3 ml-3 shadow-md transition-all duration-300 ease-in-out h-[calc(100vh-1.5rem)] sticky top-3 select-none overflow-hidden ${
          isCollapsed ? "w-20" : "w-60"
        } ${className}`}
      >
        {/* Top Header / Brand Logo & Toggle Button */}
        <div className="shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <Link href="/admin" className="flex items-center select-none">
                <Image
                  src="/elimi-logo-white.svg"
                  alt="Elimi"
                  className="object-contain"
                  width={80}
                  height={28}
                  style={{ width: "auto", height: "28px" }}
                  priority
                />
              </Link>
              <button
                type="button"
                onClick={toggleCollapse}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LuPanelLeft size={20} />
              </button>
            </div>
          ) : (
            <div className="pt-4 pb-3 px-2 flex items-center justify-center relative group/toggle h-14">
              {/* Normal Logo Mark */}
              <div className="group-hover/toggle:opacity-0 transition-opacity flex items-center justify-center">
                <AdminLogoMark size={32} />
              </div>
              {/* Hover Toggle Button */}
              <button
                type="button"
                onClick={toggleCollapse}
                title="Expand sidebar"
                aria-label="Expand sidebar"
                className="absolute inset-0 m-auto w-9 h-9 rounded-lg flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover/toggle:opacity-100 cursor-pointer"
              >
                <LuPanelRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-1.5 py-2 overflow-y-auto overflow-x-hidden">
          {ADMIN_NAV_ITEMS.map((nav) => {
            const active = isItemActive(nav.href, nav.exact);
            const Icon = nav.icon;

            if (isCollapsed) {
              return (
                <Tooltip
                  key={nav.href}
                  title={nav.label}
                  trigger={["hover"]}
                  placement="right"
                >
                  <Link
                    href={nav.href}
                    className={`w-full h-11 flex items-center justify-center transition-colors relative border-l-4 ${
                      active
                        ? "bg-white/20 border-secondary text-white"
                        : "border-transparent text-white/80 hover:text-white hover:bg-white/10 hover:border-secondary/60"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                  </Link>
                </Tooltip>
              );
            }

            return (
              <Link
                key={nav.href}
                href={nav.href}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm transition-colors relative border-l-4 ${
                  active
                    ? "bg-white/20 border-secondary text-white font-semibold"
                    : "border-transparent text-white/80 hover:text-white hover:bg-white/10 hover:border-secondary/60"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate tracking-tight">{nav.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Log Out Section */}
        <div className="pb-3 pt-2 shrink-0">
          {isCollapsed ? (
            <Tooltip title="Log Out" trigger={["hover"]} placement="right">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                aria-label="Log Out"
                className="w-full h-12 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-l-4 border-transparent hover:border-white/60 disabled:opacity-50"
              >
                <LuLogOut size={20} className="shrink-0" />
              </button>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-l-4 border-transparent hover:border-white/60 disabled:opacity-50 text-left"
            >
              <LuLogOut size={20} className="shrink-0" />
              <span className="truncate tracking-tight font-medium">
                {isPending ? "Logging out..." : "Log Out"}
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Navigation Sheet */}
      <nav
        className={`${
          isMobileOpen ? "flex md:hidden" : "hidden md:hidden"
        } flex-col bg-primary p-4 z-50 fixed inset-0 w-screen h-screen overflow-y-auto`}
      >
        <div className="flex justify-between items-center gap-4 pb-4 mb-3 border-b border-white/20">
          <div className="flex md:hidden items-center gap-2">
            <Image
              src="/elimi-logo-white.svg"
              alt="Elimi"
              className="object-contain"
              width={80}
              height={28}
              style={{ width: "auto", height: "28px" }}
              priority
            />
          </div>
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation"
            className="grid place-items-center p-1.5 rounded-lg text-white text-xs h-9 w-9 shrink-0 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col space-y-1">
            {ADMIN_NAV_ITEMS.map((nav) => {
              const active = isItemActive(nav.href, nav.exact);
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3.5 px-4 py-3 text-sm rounded-xl transition-colors ${
                    active
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="tracking-tight">{nav.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-left disabled:opacity-50"
            >
              <LuLogOut size={20} className="shrink-0" />
              <span className="tracking-tight font-medium">
                {isPending ? "Logging out..." : "Log Out"}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
