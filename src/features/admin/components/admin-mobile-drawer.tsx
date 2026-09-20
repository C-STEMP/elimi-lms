"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuX } from "react-icons/lu";
import { useAdminSidebarContext } from "../context/admin-sidebar-context";
import { AdminSidebar } from "./admin-sidebar";

export const AdminMobileDrawer: React.FC = () => {
  const { isMobileOpen, closeMobile } = useAdminSidebarContext();

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: -280, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="fixed inset-y-3 left-3 z-50 flex lg:hidden"
            onClick={(e) => {
              // Close drawer when a navigation link is clicked
              if ((e.target as HTMLElement).closest("a")) {
                closeMobile();
              }
            }}
          >
            <div className="relative">
              <AdminSidebar
                collapsed={false}
                onToggleCollapse={closeMobile}
                className="my-0 ml-0 shadow-2xl h-[calc(100vh-1.5rem)]"
              />
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close menu"
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
