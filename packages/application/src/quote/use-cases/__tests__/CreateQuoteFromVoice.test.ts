import { describe, it, expect, vi } from 'vitest';
import type { IAIQuoteService, IQuoteRepository, QuoteEntity } from '@maestro/domain';
import { CreateQuoteFromVoice } from '../CreateQuoteFromVoice';

const mockAIService: IAIQuoteService = {
  processVoiceToQuote: vi.fn().mockResolvedValue({
    id: crypto.randomUUID(),
    companyId: 'UNKNOWN',
    clientName: 'Client IA',
    status: 'DRAFT' as const,
    createdAt: new Date(),
    items: [
      {
        label: 'Isolation combles',
        quantity: 30,
        unit: 'm²' as const,
        unitPrice: { amount: 45, currency: 'EUR' },
        vatRate: 10,
        priceHT: 45,
      },
    ],
    totalHT: { amount: 1350, currency: 'EUR' },
    totalTTC: { amount: 1485, currency: 'EUR' },
  }),
};

const savedQuotes: QuoteEntity[] = [];
const mockRepository: IQuoteRepository = {
  save: vi.fn().mockImplementation(async (q: QuoteEntity) => { savedQuotes.push(q); }),
  findById: vi.fn().mockResolvedValue(null),
  findAllByCompany: vi.fn().mockResolvedValue([]),
};

describe('CreateQuoteFromVoice', () => {
  it('crée un devis depuis un transcript IA', async () => {
    const useCase = new CreateQuoteFromVoice(mockAIService, mockRepository);
    const result = await useCase.execute({
      companyId: 'company-1',
      transcript: 'Isolation de 30 m² de combles à 45€',
    });

    expect(result.clientName).toBe('Client IA');
    expect(result.items).toHaveLength(1);
    expect(mockRepository.save).toHaveBeenCalledOnce();
  });

  it('prioritise les items manuels sur l\'IA', async () => {
    savedQuotes.length = 0;
    const useCase = new CreateQuoteFromVoice(mockAIService, mockRepository);
    const result = await useCase.execute({
      companyId: 'company-1',
      transcript: 'Pose carrelage',
      items: [
        { label: 'Carrelage manuel', quantity: 20, priceHT: 60 },
      ],
    });

    expect(result.items[0]?.toJSON().label).toBe('Carrelage manuel');
    expect(result.totalHT).toBe(1200);
  });

  it('lève une erreur si aucun item n\'est disponible', async () => {
    const emptyAI: IAIQuoteService = {
      processVoiceToQuote: vi.fn().mockResolvedValue({
        id: crypto.randomUUID(),
        companyId: 'UNKNOWN',
        clientName: 'X',
        status: 'DRAFT' as const,
        createdAt: new Date(),
        items: [],
        totalHT: { amount: 0, currency: 'EUR' },
        totalTTC: { amount: 0, currency: 'EUR' },
      }),
    };
    const useCase = new CreateQuoteFromVoice(emptyAI, mockRepository);

    await expect(useCase.execute({ companyId: 'c1', transcript: '...' })).rejects.toThrow(
      'Aucun détail de travaux',
    );
  });

  it('fonctionne sans appel IA si items manuels fournis', async () => {
    const noAI: IAIQuoteService = { processVoiceToQuote: vi.fn() };
    const useCase = new CreateQuoteFromVoice(noAI, mockRepository);

    const result = await useCase.execute({
      companyId: 'company-1',
      clientName: 'Dupont SARL',
      items: [{ label: 'Peinture', quantity: 5, priceHT: 100 }],
    });

    expect(result.clientName).toBe('Dupont SARL');
    expect(noAI.processVoiceToQuote).not.toHaveBeenCalled();
  });
});
