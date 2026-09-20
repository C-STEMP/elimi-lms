import { LuUser, LuBookOpen, LuAward } from "react-icons/lu";
import type {
  AdminStatItem,
  MonthlyRevenueItem,
  TopCourseItem,
  AgeDistributionData,
} from "../types/overview";

export const DEFAULT_ADMIN_STATS: readonly AdminStatItem[] = [
  {
    id: "total-learners",
    title: "Total Learners",
    value: "100,098",
    icon: LuUser,
    iconColor: "text-amber-500",
  },
  {
    id: "total-courses",
    title: "Total Courses",
    value: "3,842",
    icon: LuBookOpen,
    iconColor: "text-primary",
  },
  {
    id: "certified-learners",
    title: "Certified Leaners",
    value: "8,214",
    icon: LuAward,
    iconColor: "text-emerald-500",
  },
  {
    id: "active-enrollment",
    title: "Active Enrollment",
    value: "18,650",
    icon: LuUser,
    iconColor: "text-amber-500",
  },
] as const;

export const DEFAULT_MONTHLY_REVENUE: readonly MonthlyRevenueItem[] = [
  { month: "Jan", revenue: 470000 },
  { month: "Feb", revenue: 560000 },
  { month: "Mar", revenue: 360000 },
  { month: "Apr", revenue: 430000 },
  { month: "May", revenue: 810000 },
  { month: "Jun", revenue: 280000 },
  { month: "Jul", revenue: 740000 },
  { month: "Aug", revenue: 530000 },
  { month: "Sep", revenue: 980000 },
  { month: "Oct", revenue: 120000 },
  { month: "Nov", revenue: 90000 },
  { month: "Dec", revenue: 730000 },
] as const;

export const DEFAULT_TOP_COURSES: readonly TopCourseItem[] = [
  { id: "1", title: "ICT & Network Infrastructure", count: "2,890" },
  { id: "2", title: "ICT & Network Infrastructure", count: "2,000" },
  { id: "3", title: "Electrical Installation", count: "1,890" },
  { id: "4", title: "Fashion Design & Tailoring", count: "1,390" },
  { id: "5", title: "Welding & Fabrication", count: "1,190" },
] as const;


export const DEFAULT_AGE_DISTRIBUTION: AgeDistributionData = {
  centerMetric: "216.51",
  segments: [
    { name: "Male", count: 7420, percentage: 59, color: "#8280EA" },
    { name: "Female", count: 5066, percentage: 41, color: "#FF928A" },
  ],
};
