'use server';

import { container } from '@maestro/infrastructure';
import { CreateQuoteFromVoice } from '@maestro/application';
import type { CreateQuoteInput } from '@maestro/application';
import type { IAIQuoteService, IQuoteRepository } from '@maestro/domain';

export async function processVoiceAction(formData: FormData) {
  const clientName = (formData.get('clientName') as string) ?? '';
  const transcript = (formData.get('transcript') as string) ?? '';

  const input: CreateQuoteInput = {
    companyId: 'default-company',
    clientName,
    transcript,
  };

  const aiService = container.resolve('IAIQuoteService') as IAIQuoteService;
  const quoteRepository = container.resolve('IQuoteRepository') as IQuoteRepository;

  const useCase = new CreateQuoteFromVoice(aiService, quoteRepository);

  try {
    const result = await useCase.execute(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('processVoiceAction failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
