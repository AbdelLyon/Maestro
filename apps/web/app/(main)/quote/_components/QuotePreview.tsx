import { QuoteEntity } from "@maestro/core";
import { CardContent } from "@maestro/ui";
import { TableHeader } from "@maestro/ui";
import { TableHead } from "@maestro/ui";
import { TableCell } from "@maestro/ui";
import { TableBody } from "@maestro/ui";
import { TableRow } from "@maestro/ui";
import { Table } from "@maestro/ui";
import { CardTitle } from "@maestro/ui";
import { CardHeader } from "@maestro/ui";
import { Card } from "@maestro/ui";

interface QuotePreviewProps {
  quote: QuoteEntity;
}

export function QuotePreview({ quote }: QuotePreviewProps) {
  return (
    <Card className="w-full shadow-sm border bg-card text-card-foreground">
      {/* HEADER */}
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Devis — {quote.clientName}
        </CardTitle>

        <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          {quote.clientAddress && (
            <div>📍 Chantier : {quote.clientAddress}</div>
          )}

          {quote.contactInfo && <div>📞 Contact : {quote.contactInfo}</div>}

          {quote.startDate && <div>📅 Démarrage : {quote.startDate}</div>}
        </div>
      </CardHeader>

      {/* TABLE */}
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-center w-[120px]">
                  Quantité
                </TableHead>
                <TableHead className="text-right w-[140px]">Prix HT</TableHead>
                <TableHead className="text-right w-[140px]">Total HT</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {quote.items.map((item: any, index: number) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="font-medium">{item.label}</TableCell>

                  <TableCell className="text-center text-muted-foreground">
                    {item.quantity}
                    {item.unit && (
                      <span className="text-xs ml-1 text-muted-foreground">
                        {item.unit}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {item.priceHT.toFixed(2)} €
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {(item.quantity * item.priceHT).toFixed(2)} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* TOTAL */}
        <div className="mt-6 flex justify-end">
          <div className="text-right space-y-1">
            <div className="text-sm text-muted-foreground">Total HT</div>
            <div className="text-2xl font-bold tracking-tight">
              {quote.totalHT.toFixed(2)} €
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
