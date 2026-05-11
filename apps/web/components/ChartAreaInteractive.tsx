"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  useIsMobile,
  ChartUI,
  Charts,
  Icons,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
  type ChartConfig,
} from "@maestro/ui";

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
];

/* -------------------------------------------------------------------------- */

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },

  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

/* -------------------------------------------------------------------------- */

const RANGE_MAP = {
  "90d": chartData,
  "30d": chartData.slice(-30),
  "7d": chartData.slice(-7),
} as const;

/* -------------------------------------------------------------------------- */

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();

  const [timeRange, setTimeRange] = useState<keyof typeof RANGE_MAP>(
    isMobile ? "7d" : "90d",
  );

  /* ------------------------------- FILTERED ------------------------------- */

  const filteredData = useMemo(() => {
    return RANGE_MAP[timeRange];
  }, [timeRange]);

  /* -------------------------------- TOTAL -------------------------------- */

  const totalVisitors = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => acc + item.desktop + item.mobile,
      0,
    );
  }, [filteredData]);

  /* -------------------------------------------------------------------------- */

  return (
    <Card className="@container/card border-border/60 bg-gradient-to-t from-primary/5 to-card shadow-xs">
      {/* HEADER */}
      <CardHeader className="space-y-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* LEFT */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icons.ActivityIcon className="size-5" />
              </div>

              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Activité visiteurs
                </CardTitle>

                <CardDescription>
                  Analyse du trafic et des visites
                </CardDescription>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold tracking-tight tabular-nums">
                {totalVisitors.toLocaleString("en-US")}
              </div>

              <Badge
                variant="outline"
                className="mb-1 gap-1 rounded-md border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
              >
                <Icons.TrendingUpIcon className="size-3.5" />
                +18.2%
              </Badge>
            </div>
          </div>

          {/* RIGHT */}
          <CardAction className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => {
                if (value) {
                  setTimeRange(value as keyof typeof RANGE_MAP);
                }
              }}
              variant="outline"
              className="hidden @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">90 jours</ToggleGroupItem>

              <ToggleGroupItem value="30d">30 jours</ToggleGroupItem>

              <ToggleGroupItem value="7d">7 jours</ToggleGroupItem>
            </ToggleGroup>

            <Select
              value={timeRange}
              onValueChange={(value) =>
                setTimeRange(value as keyof typeof RANGE_MAP)
              }
            >
              <SelectTrigger className="w-36 @[767px]/card:hidden">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                <SelectItem value="90d">90 jours</SelectItem>

                <SelectItem value="30d">30 jours</SelectItem>

                <SelectItem value="7d">7 jours</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>

      {/* CHART */}
      <CardContent className="px-2 pt-0 sm:px-6">
        <ChartUI.Container
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <Charts.AreaChart data={filteredData}>
            {/* GRADIENTS */}
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* GRID */}
            <Charts.CartesianGrid vertical={false} />

            {/* X AXIS */}
            <Charts.XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);

                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            {/* TOOLTIP */}
            <ChartUI.Tooltip
              cursor={false}
              content={
                <ChartUI.TooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
              }
            />

            {/* MOBILE */}
            <Charts.Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />

            {/* DESKTOP */}
            <Charts.Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </Charts.AreaChart>
        </ChartUI.Container>
      </CardContent>
    </Card>
  );
}
