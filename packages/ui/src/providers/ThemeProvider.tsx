"use client";

import * as React from "react";
import { ThemeProvider as BaseProvider } from "next-themes";

import { TooltipProvider } from "../components/tooltip";
import { SidebarProvider } from "../components/sidebar";

type ThemeProviderProps = React.ComponentProps<typeof BaseProvider> & {
  sidebarWidth?: string;
  headerHeight?: string;
};

export const ThemeProvider = ({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
  sidebarWidth = "18rem",
  headerHeight = "4rem",
  ...props
}: ThemeProviderProps) => {
  return (
    <BaseProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": sidebarWidth,
              "--header-height": headerHeight,
            } as React.CSSProperties
          }
        >
          {children}
        </SidebarProvider>
      </TooltipProvider>
    </BaseProvider>
  );
};
