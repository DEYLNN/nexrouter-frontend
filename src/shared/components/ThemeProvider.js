"use client";

import { useTheme } from "@/shared/hooks/useTheme";

export function ThemeProvider({ children }) {
  useTheme();
  return <>{children}</>;
}
