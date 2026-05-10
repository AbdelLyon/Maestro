'use server';

import { container } from '@batisseur/core';
import { CreateQuoteFromVoice, type CreateQuoteInput } from '@batisseur/core';

export async function processVoiceAction(formData: FormData) {
  const clientName = (formData.get('clientName') as string) ?? '';
  const transcript = (formData.get('transcript') as string) ?? '';

  const input: CreateQuoteInput = {
    clientName,
    transcript,
  };

  const useCase = container.resolve(CreateQuoteFromVoice);
  console.log("Use Case résolu par TSyringe:", useCase);

  try {
    const result = await useCase.execute(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('processVoiceAction failed:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Erreur inconnue',
    };
  }
}