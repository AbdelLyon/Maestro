"use client"
import * as RechartsPrimitive from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/chart";

import type { ChartConfig } from "../components/chart";

// Recharts namespace
export const Charts = RechartsPrimitive;

// UI namespace
export const ChartUI = {
  Container: ChartContainer,
  Legend: ChartLegend,
  LegendContent: ChartLegendContent,
  Style: ChartStyle,
  Tooltip: ChartTooltip,
  TooltipContent: ChartTooltipContent,
};

// Type exports
export type { ChartConfig };