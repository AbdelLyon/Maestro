'use server';

import { container } from '@maestro/core';
import {
  CreateQuoteFromVoice,
  type CreateQuoteInput,
  type IAIQuoteService,
  type IQuoteRepository,
} from '@maestro/core';

export async function processVoiceAction(formData: FormData) {
  const clientName = (formData.get('clientName') as string) ?? '';
  const transcript = (formData.get('transcript') as string) ?? '';

  const input: CreateQuoteInput = {
    companyId: 'default-company', // TODO: get from user session
    clientName,
    transcript,
  };

  const aiService = container.resolve("IAIQuoteService") as IAIQuoteService;
  const quoteRepository = container.resolve("IQuoteRepository") as IQuoteRepository;

  const useCase = new CreateQuoteFromVoice(aiService, quoteRepository);
  console.log("Use Case instancié (constructeur plain).");

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
