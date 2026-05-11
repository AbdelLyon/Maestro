import {
  type IAIQuoteService,
  type IQuoteRepository,
  QuoteEntity,
  QuoteSchema,
  type Quote,
} from "../..";

import type { AIQuote } from "../../infrastructure/schemas/AIQuoteSchema";

export type CreateQuoteInput = {
  clientName?: string; // Optionnel car l'IA peut le trouver
  companyId: string;
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
    unit?: "u" | "m²" | "ml" | "m³" | "kg" | "h" | "forfait";
  }>;
};

export class CreateQuoteFromVoice {
  constructor(
    private aiService: IAIQuoteService,
    private quoteRepository: IQuoteRepository
  ) {}

  async execute(input: CreateQuoteInput): Promise<QuoteEntity> {
    let aiQuote: Quote | undefined;

    // 1. Appel de l'IA si un transcript est fourni
    if (input.transcript) {
      aiQuote = await this.aiService.processVoiceToQuote(input.transcript);
    }

    // 2. Fusion intelligente (Priorité à l'input manuel, fallback sur l'IA)
    const clientName =
      input.clientName ?? aiQuote?.clientName ?? "Client à préciser";

    const items =
      input.items && input.items.length > 0
        ? input.items.map((i) => ({
            label: i.label,
            quantity: i.quantity,
            unit: i.unit ?? "u",
            vatRate: 10,
            unitPrice: { amount: i.priceHT, currency: "EUR" },
            priceHT: i.priceHT,
          }))
        : (aiQuote?.items ?? []).map((i) => {
            const unit = i.unit ?? "u";
            const priceHT = i.priceHT ?? 0;
            return {
              label: i.label,
              quantity: i.quantity ?? 1,
              unit,
              vatRate: 10,
              unitPrice: { amount: priceHT, currency: "EUR" },
              priceHT,
            };
          });

    if (items.length === 0) {
      throw new Error('Aucun détail de travaux trouvé. Merci de dicter les prestations.');
    }

    // 3. Calculs financiers de sécurité (toujours recalculer pour éviter les erreurs de l'input)
    const totalHT = items.reduce((sum, item) => sum + (item.quantity * item.priceHT), 0);
    const totalTTC = items.reduce((sum, item) => sum + (item.quantity * item.priceHT * 1.1), 0);

    // 4. Assemblage final respectant QuoteSchema
    const finalQuote: Quote = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: 'DRAFT',
      clientName: clientName,
      companyId: input.companyId,
      clientAddress: input.clientAddress || aiQuote?.clientAddress || '',
      contactInfo: input.contactInfo || aiQuote?.contactInfo || '',
      projectType: input.projectType || aiQuote?.projectType || 'Nouveau Chantier',
      startDate: input.startDate || aiQuote?.startDate || '',
      notes: input.notes || aiQuote?.notes || '',
      items,
      totalHT: { amount: totalHT, currency: 'EUR' },
      totalTTC: { amount: totalTTC, currency: 'EUR' },
    };

    // 5. Validation par le schéma de domaine (Zod)
    const validatedQuote = QuoteSchema.parse(finalQuote);

    // 6. Création de l'entité domaine
    const quoteEntity = QuoteEntity.fromJSON(validatedQuote);

    // 7. Persistance
    await this.quoteRepository.save(quoteEntity);

    return quoteEntity;
  }
}
