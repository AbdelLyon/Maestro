
import { useMutation } from "@tanstack/react-query";
import { processVoiceAction } from "../actions";

export function useGenerateQuote() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await processVoiceAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Erreur IA");
      }

      return result.data;
    },
  });
}