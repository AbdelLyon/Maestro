import {
  type IAIQuoteService,
  type IQuoteRepository,
  QuoteEntity,
  QuoteSchema,
  type Quote,
} from '@maestro/domain';
import type { CreateQuoteInput } from '../dtos/CreateQuoteInput';

export class CreateQuoteFromVoice {
  constructor(
    private readonly aiService: IAIQuoteService,
    private readonly quoteRepository: IQuoteRepository,
  ) {}

  async execute(input: CreateQuoteInput): Promise<QuoteEntity> {
    let aiQuote: Quote | undefined;

    if (input.transcript) {
      aiQuote = await this.aiService.processVoiceToQuote(input.transcript);
    }

    const clientName = input.clientName ?? aiQuote?.clientName ?? 'Client à préciser';

    const items =
      input.items && input.items.length > 0
        ? input.items.map((i) => ({
            label: i.label,
            quantity: i.quantity,
            unit: i.unit ?? 'u' as const,
            vatRate: 10,
            unitPrice: { amount: i.priceHT, currency: 'EUR' },
            priceHT: i.priceHT,
          }))
        : (aiQuote?.items ?? []).map((i) => {
            const priceHT = i.priceHT ?? 0;
            return {
              label: i.label,
              quantity: i.quantity ?? 1,
              unit: i.unit ?? ('u' as const),
              vatRate: 10,
              unitPrice: { amount: priceHT, currency: 'EUR' },
              priceHT,
            };
          });

    if (items.length === 0) {
      throw new Error('Aucun détail de travaux trouvé. Merci de dicter les prestations.');
    }

    const totalHT = items.reduce(
      (sum: number, item: { quantity: number; priceHT: number }) => sum + item.quantity * item.priceHT,
      0,
    );
    const totalTTC = items.reduce(
      (sum: number, item: { quantity: number; priceHT: number }) => sum + item.quantity * item.priceHT * 1.1,
      0,
    );

    const finalQuote: Quote = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: 'DRAFT',
      clientName,
      companyId: input.companyId,
      clientAddress: input.clientAddress ?? aiQuote?.clientAddress ?? '',
      contactInfo: input.contactInfo ?? aiQuote?.contactInfo ?? '',
      projectType: input.projectType ?? aiQuote?.projectType ?? 'Nouveau Chantier',
      startDate: input.startDate ?? aiQuote?.startDate ?? '',
      notes: input.notes ?? aiQuote?.notes ?? '',
      items,
      totalHT: { amount: totalHT, currency: 'EUR' },
      totalTTC: { amount: totalTTC, currency: 'EUR' },
    };

    const validated = QuoteSchema.parse(finalQuote);
    const entity = QuoteEntity.fromJSON(validated);
    await this.quoteRepository.save(entity);

    return entity;
  }
}
