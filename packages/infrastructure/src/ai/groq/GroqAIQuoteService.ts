import { generateText, Output } from 'ai';
import { groq, type GroqLanguageModelOptions } from '@ai-sdk/groq';
import { v4 as uuidv4 } from 'uuid';

import { QuoteSchema, type Quote, type IAIQuoteService } from '@maestro/domain';
import { normalizeUnit } from '../utils/normalizeUnit';
import { AIQuoteSchema, type AIQuote } from '../schemas/AIQuoteSchema';

export class GroqAIQuoteService implements IAIQuoteService {
  private readonly model = groq('llama-3.3-70b-versatile');

  async processVoiceToQuote(transcript: string): Promise<Quote> {
    this.assertEnv();
    const raw = await this.callGroq(transcript);
    const items = this.mapItems(raw);
    this.assertItems(items);
    return QuoteSchema.parse(this.buildQuote(raw, items));
  }

  private assertEnv(): void {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY non configurée.');
    }
  }

  private async callGroq(transcript: string): Promise<AIQuote> {
    const result = await generateText({
      model: this.model,
      output: Output.object({ schema: AIQuoteSchema }),
      providerOptions: {
        groq: { structuredOutputs: false } satisfies GroqLanguageModelOptions,
      },
      temperature: 0,
      system: this.systemPrompt(),
      prompt: `Transforme cette dictée en JSON devis :"${transcript}"`,
    });
    return result.output;
  }

  private systemPrompt(): string {
    return `Tu es un assistant spécialisé dans les devis BTP.
Tu dois répondre UNIQUEMENT en JSON valide.
Structure : clientName, projectType, items (label, quantity, unit, priceHT).
Unités autorisées : u, m², ml, m³, kg, h, forfait.
Règles : quantity=1 si absent, priceHT=0 si absent.`;
  }

  private mapItems(raw: AIQuote): Quote['items'] {
    return raw.items.map((item) => {
      const unit = normalizeUnit(item.unit);
      const priceHT = Number(item.priceHT ?? 0);
      return {
        label: item.label ?? 'Prestation',
        quantity: Number(item.quantity ?? 1),
        unit,
        vatRate: 10,
        unitPrice: { amount: priceHT, currency: 'EUR' },
        priceHT,
      };
    });
  }

  private assertItems(items: Quote['items']): void {
    if (items.length === 0) throw new Error('Aucune prestation détectée.');
  }

  private buildQuote(raw: AIQuote, items: Quote['items']): Quote {
    const totalHT = items.reduce((acc, i) => acc + i.quantity * i.priceHT, 0);
    return {
      id: uuidv4(),
      createdAt: new Date(),
      status: 'DRAFT',
      companyId: 'UNKNOWN',
      clientName: raw.clientName ?? 'Client à préciser',
      clientAddress: '',
      contactInfo: '',
      projectType: raw.projectType ?? '',
      startDate: '',
      notes: raw.notes ?? '',
      items,
      totalHT: { amount: totalHT, currency: 'EUR' },
      totalTTC: { amount: totalHT * 1.1, currency: 'EUR' },
    };
  }
}
