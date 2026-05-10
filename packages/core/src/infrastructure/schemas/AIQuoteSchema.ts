import { z } from 'zod';
import { UnitEnum } from '../../domain/entities/Quote';


/**
 * Schema STRICTEMENT IA (tolérant)
 */
export const AIQuoteSchema = z.object({
  clientName: z.string().optional(),
  projectType: z.string().optional(),
  notes: z.string().optional(),

  items: z
    .array(
      z.object({
        label: z.string(),
        quantity: z.coerce.number().optional().default(1),
        unit: UnitEnum.optional(),
        priceHT: z.coerce.number().optional().default(0),
      })
    )
    .optional()
    .default([]),
});

export type AIQuote = z.infer<typeof AIQuoteSchema>;