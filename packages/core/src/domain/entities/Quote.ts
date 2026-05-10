import { z } from 'zod';

/**
 * Unités métier BTP
 */
export const UnitEnum = z.enum([
  'u',
  'm²',
  'ml',
  'm³',
  'kg',
  'h',
  'forfait',
]).default('u');

/**
 * ITEM MÉTIER
 */
export const QuoteItemSchema = z.object({
  label: z.string().min(2, 'La désignation est requise'),
  quantity: z.coerce.number().min(0).default(1),
  unit: UnitEnum,
  priceHT: z.coerce.number().min(0).default(0),
  taxRate: z.number().default(10),
});

/**
 * DEVIS MÉTIER
 */
export const QuoteSchema = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.date().default(() => new Date()),
  status: z.enum(['DRAFT', 'SENT', 'SIGNED', 'PAID']).default('DRAFT'),

  clientName: z.string().min(2, 'Nom du client requis'),
  clientAddress: z.string().optional(),
  contactInfo: z.string().optional(),

  projectType: z.string().optional(),
  startDate: z.string().optional(),
  notes: z.string().optional(),

  items: z.array(QuoteItemSchema),

  totalHT: z.number().default(0),
  totalTTC: z.number().default(0),
});

export type Quote = z.infer<typeof QuoteSchema>;
export type QuoteItem = z.infer<typeof QuoteItemSchema>;