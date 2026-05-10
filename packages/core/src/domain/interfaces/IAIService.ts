import type { Quote } from '../entities/Quote';

export interface IAIQuoteService {
  // On définit le contrat sans dire que c'est Groq
  processVoiceToQuote(transcript: string): Promise<Quote>;
}