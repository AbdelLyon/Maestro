import { RefObject, SubmitEvent } from "react";

import { Button, Input, Label, Textarea } from "@maestro/ui";

type QuoteFormProps = {
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  formRef: RefObject<HTMLFormElement | null>;
  isPending: boolean;
  error: Error | null;
};

export const QuoteForm = ({
  onSubmit,
  formRef,
  isPending,
  error,
}: QuoteFormProps) => {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 md:p-8"
    >
      {/* TITLE SECTION */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Nouveau devis</h2>
        <p className="text-sm text-muted-foreground">
          Remplis les informations pour générer un devis intelligent
        </p>
      </div>

      {/* CLIENT NAME */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Nom du client</Label>
        <Input
          name="clientName"
          placeholder="Ex: M. Dupont"
          className="h-11 rounded-md bg-background border-border focus:ring-ring"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Description du chantier</Label>

        <Textarea
          name="projectDescription"
          placeholder="Décris le chantier : travaux, contraintes, budget..."
          className="min-h-[140px] rounded-md bg-background border-border focus:ring-ring resize-none"
        />

        <p className="text-xs text-muted-foreground">
          Plus la description est précise, plus le devis IA sera pertinent.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-xl font-medium"
      >
        {isPending ? "Génération du devis..." : "Générer le devis"}
      </Button>
    </form>
  );
};
