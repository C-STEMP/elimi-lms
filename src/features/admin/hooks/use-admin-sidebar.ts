"use client";

import { useCallback, useState } from "react";

export interface UseAdminSidebarReturn {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function useAdminSidebar(defaultCollapsed = false): UseAdminSidebarReturn {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return {
    isCollapsed,
    toggleCollapse,
    setIsCollapsed,
  };
}
