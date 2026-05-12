import { QuoteEntity } from '@maestro/domain';

type DecimalLike = { toNumber?: () => number } | number | string;

type PrismaQuoteRow = {
  id: string;
  company_id: string;
  client_name: string;
  status: string;
  total_ht: DecimalLike;
  total_ttc: DecimalLike;
  created_at: Date | string;
  items: Array<{
    label: string;
    quantity: number;
    unit_price: DecimalLike;
    vat_rate: number;
  }>;
};

function toNumber(value: DecimalLike): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (typeof value?.toNumber === 'function') return value.toNumber();
  return Number(value);
}

export function toDomain(row: PrismaQuoteRow): QuoteEntity {
  return QuoteEntity.fromJSON({
    id: row.id,
    companyId: row.company_id,
    clientName: row.client_name,
    status: row.status,
    createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
    items: row.items.map((i) => {
      const unitPrice = toNumber(i.unit_price);
      return {
        label: i.label,
        quantity: i.quantity,
        unit: 'u',
        unitPrice: { amount: unitPrice, currency: 'EUR' },
        vatRate: i.vat_rate,
        priceHT: unitPrice,
      };
    }),
    totalHT: { amount: toNumber(row.total_ht), currency: 'EUR' },
    totalTTC: { amount: toNumber(row.total_ttc), currency: 'EUR' },
    clientAddress: '',
    contactInfo: '',
    projectType: '',
    startDate: '',
    notes: '',
  });
}

export function toCreateInput(quote: QuoteEntity) {
  const json = quote.toJSON();
  return {
    id: json.id,
    company_id: json.companyId,
    client_name: json.clientName,
    status: json.status,
    total_ht: json.totalHT,
    total_ttc: json.totalTTC,
    items: {
      create: json.items.map((item) => ({
        label: item.label,
        quantity: item.quantity,
        unit_price: item.unitPrice.amount,
        vat_rate: item.vatRate,
      })),
    },
  };
}
