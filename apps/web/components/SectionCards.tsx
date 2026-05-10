"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Icons,
} from "@maestro/ui";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      {/* CARD 1 */}
      <Card className="@container/card border-border/60">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm text-muted-foreground">
                Chiffre d’affaires
              </CardDescription>

              <CardTitle className="text-3xl font-semibold tracking-tight tabular-nums">
                12 450 €
              </CardTitle>
            </div>

            <CardAction>
              <Badge
                variant="outline"
                className="gap-1 rounded-md border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
              >
                <Icons.TrendingUpIcon className="size-3.5" />
                +12.5%
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-1 font-medium">
            Forte croissance ce mois-ci
            <Icons.TrendingUpIcon className="size-4 text-green-500" />
          </div>

          <div className="text-muted-foreground">
            Progression stable sur les 30 derniers jours
          </div>
        </CardFooter>
      </Card>

      {/* CARD 2 */}
      <Card className="@container/card border-border/60">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm text-muted-foreground">
                Nouveaux clients
              </CardDescription>

              <CardTitle className="text-3xl font-semibold tracking-tight tabular-nums">
                128
              </CardTitle>
            </div>

            <CardAction>
              <Badge
                variant="outline"
                className="gap-1 rounded-md border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
              >
                <Icons.TrendingDownIcon className="size-3.5" />
                -8%
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-1 font-medium">
            Léger ralentissement
            <Icons.TrendingDownIcon className="size-4 text-red-500" />
          </div>

          <div className="text-muted-foreground">
            Acquisition en baisse cette semaine
          </div>
        </CardFooter>
      </Card>

      {/* CARD 3 */}
      <Card className="@container/card border-border/60">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm text-muted-foreground">
                Devis générés
              </CardDescription>

              <CardTitle className="text-3xl font-semibold tracking-tight tabular-nums">
                542
              </CardTitle>
            </div>

            <CardAction>
              <Badge
                variant="outline"
                className="gap-1 rounded-md border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
              >
                <Icons.TrendingUpIcon className="size-3.5" />
                +24%
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-1 font-medium">
            Activité en hausse
            <Icons.TrendingUpIcon className="size-4 text-green-500" />
          </div>

          <div className="text-muted-foreground">
            Les équipes sont très actives aujourd’hui
          </div>
        </CardFooter>
      </Card>

      {/* CARD 4 */}
      <Card className="@container/card border-border/60">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm text-muted-foreground">
                Taux de conversion
              </CardDescription>

              <CardTitle className="text-3xl font-semibold tracking-tight tabular-nums">
                68%
              </CardTitle>
            </div>

            <CardAction>
              <Badge
                variant="outline"
                className="gap-1 rounded-md border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
              >
                <Icons.TrendingUpIcon className="size-3.5" />
                +4.2%
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-1 font-medium">
            Excellentes performances
            <Icons.TrendingUpIcon className="size-4 text-green-500" />
          </div>

          <div className="text-muted-foreground">
            Les objectifs mensuels sont dépassés
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
