import { normalizeUnit } from '../../utils/normalizeUnit';
import { AIQuote } from '../types/AIQuoteType';

export type QuoteItemDTO = {
  label: string;
  quantity: number;
  unit: string;
  priceHT: number;
  taxRate: number;
};

export function mapAIToItems(raw: AIQuote): QuoteItemDTO[] {
  return (raw.items ?? []).map((item) => ({
    label: item.label ?? 'Prestation',
    quantity: Number(item.quantity ?? 1),
    unit: normalizeUnit(item.unit),
    priceHT: Number(item.priceHT ?? 0),
    taxRate: 10,
  }));
}