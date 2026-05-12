import type { Unit } from '@maestro/domain';

export type CreateQuoteInput = {
  companyId: string;
  clientName?: string;
  clientAddress?: string;
  contactInfo?: string;
  projectType?: string;
  startDate?: string;
  notes?: string;
  transcript?: string;
  items?: Array<{
    label: string;
    quantity: number;
    priceHT: number;
    unit?: Unit;
  }>;
};
