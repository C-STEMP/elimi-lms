import type { ComponentType } from "react";

export interface AdminNavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: ComponentType<{ className?: string }>;
  readonly exact?: boolean;
}

export interface AdminSidebarProps {
  readonly collapsed?: boolean;
  readonly onToggleCollapse?: () => void;
  readonly className?: string;
}

export interface AdminSidebarItemProps {
  readonly item: AdminNavItem;
  readonly isActive: boolean;
  readonly isCollapsed: boolean;
}

export interface AdminSidebarLogoProps {
  readonly isCollapsed: boolean;
  readonly onToggleCollapse: () => void;
}

export interface AdminSidebarNavProps {
  readonly items: readonly AdminNavItem[];
  readonly isCollapsed: boolean;
}

export interface AdminSidebarFooterProps {
  readonly isCollapsed: boolean;
}
