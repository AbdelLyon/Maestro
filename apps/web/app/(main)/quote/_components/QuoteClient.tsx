"use client";

import { SubmitEvent, useRef } from "react";
import { QuotePreview } from "@/app/(main)/quote/_components/QuotePreview";

import { QuoteForm } from "./QuoteForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { useGenerateQuote } from "../_hooks/useGenerateQuote";

export const QuoteClient = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const { mutate, data, isPending, error } = useGenerateQuote();

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const clientName = formData.get("clientName")?.toString().trim();
    const projectDescription = formData
      .get("projectDescription")
      ?.toString()
      .trim();

    if (!clientName || !projectDescription) return;

    formData.set("transcript", projectDescription);

    mutate(formData);
  }

  return (
    <PageContainer
      classNames={{
        base: "p-4",
      }}
    >
      <QuoteForm
        formRef={formRef}
        onSubmit={handleSubmit}
        isPending={isPending}
        error={error instanceof Error ? error : null}
      />

      {data && (
        <div className="mt-8">
          <QuotePreview quote={data} />
        </div>
      )}
    </PageContainer>
  );
};
