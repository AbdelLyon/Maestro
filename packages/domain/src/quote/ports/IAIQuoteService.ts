import type { Quote } from '../entities/Quote';

export interface IAIQuoteService {
  processVoiceToQuote(transcript: string): Promise<Quote>;
}
