import { AIQuoteSchema } from '../schemas/AIQuoteSchema';
import { z } from 'zod';

export type AIQuote = z.infer<typeof AIQuoteSchema>;

export type AIItem = AIQuote['items'][number];