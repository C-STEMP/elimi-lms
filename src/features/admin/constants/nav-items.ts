import {
  LuLayoutGrid,
  LuBookOpen,
  LuGraduationCap,
  LuUserPlus,
  LuUsers,
  LuCreditCard,
  LuSettings,
} from "react-icons/lu";
import type { AdminNavItem } from "../types";

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: LuLayoutGrid,
    exact: true,
  },
  {
    label: "Trades & Courses",
    href: "/admin/courses",
    icon: LuBookOpen,
  },
  {
    label: "Learners",
    href: "/admin/learners",
    icon: LuGraduationCap,
  },
  {
    label: "Enrollment",
    href: "/admin/enrollment",
    icon: LuUserPlus,
  },
  {
    label: "Staff",
    href: "/admin/staff",
    icon: LuUsers,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: LuCreditCard,
  },
  {
    label: "Configuration",
    href: "/admin/configuration",
    icon: LuSettings,
  },
] as const;
