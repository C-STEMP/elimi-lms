import type { ThemeConfig } from "antd";

/** Mirrors the Elimi brand tokens in globals.css's @theme block. */
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#aa1d3f",
    colorLink: "#aa1d3f",
    colorLinkHover: "#8f1532",

    fontFamily:
      "var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,

    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    colorBgContainer: "#f5f6fa",
    colorBorder: "transparent",
    colorBorderSecondary: "#d9d9d9",

    colorText: "#1e1e1e",
    colorTextSecondary: "#7a6b6e",
    colorTextPlaceholder: "#9ca3af",

    colorError: "#aa1d3f",
    colorErrorBorder: "#b3261e",

    colorSuccess: "#16a34a",
    colorInfo: "#0284c7",

    controlHeight: 44,
    controlHeightLG: 48,
    controlHeightSM: 36,
  },
  components: {
    Button: {
      primaryColor: "#ffffff",
      defaultBg: "#ffffff",
      borderRadius: 12,
      borderRadiusLG: 14,
    },
    Input: {
      activeBorderColor: "rgba(117, 21, 43, 0.4)",
      activeShadow: "0 0 0 2px rgba(117, 21, 43, 0.1)",
      hoverBorderColor: "#d9d9d9",
    },
  },
};
