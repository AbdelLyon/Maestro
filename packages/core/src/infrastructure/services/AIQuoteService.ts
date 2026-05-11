import { generateText, Output } from 'ai';
import { groq, type GroqLanguageModelOptions } from '@ai-sdk/groq';
import { v4 as uuidv4 } from 'uuid';

import {
  Quote,
  QuoteSchema,

} from '../../domain/entities/Quote';

import { IAIQuoteService } from '../../domain/interfaces/IAIService';
import { normalizeUnit } from '../../utils/normalizeUnit';
import { AIQuoteSchema, type AIQuote } from '../schemas/AIQuoteSchema';

/**
 * ---------------------------------------------------
 * SERVICE
 * ---------------------------------------------------
 */

export class AIQuoteService implements IAIQuoteService {
  private model = groq('llama-3.3-70b-versatile');

  /**
   * ENTRYPOINT
   */
  async processVoiceToQuote(transcript: string): Promise<Quote> {
    this.assertEnv();

    const raw = await this.callGroq(transcript);

    const items = this.mapAIToItems(raw);

    this.assertItems(items);

    const quote = this.buildQuote(raw, items);

    return QuoteSchema.parse(quote);
  }

  /**
   * ---------------------------------------------------
   * 1. ENV CHECK
   * ---------------------------------------------------
   */
  private assertEnv() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY non configurée.');
    }
  }

  /**
   * ---------------------------------------------------
   * 2. GROQ CALL
   * ---------------------------------------------------
   */
  private async callGroq(transcript: string): Promise<AIQuote> {
    const result = await generateText({
      model: this.model,

      output: Output.object({
        schema: AIQuoteSchema,
      }),

      providerOptions: {
        groq: {
          structuredOutputs: false,
        } satisfies GroqLanguageModelOptions,
      },

      temperature: 0,

      system: this.buildSystemPrompt(),

      prompt: this.buildPrompt(transcript),
    });

    return result.output;
  }

  /**
   * ---------------------------------------------------
   * 3. PROMPT
   * ---------------------------------------------------
   */
  private buildSystemPrompt(): string {
    return `Tu es un assistant spécialisé dans les devis BTP.
            Tu dois répondre UNIQUEMENT en JSON valide.
            Structure :
            - clientName
            - projectType
            - items
            Chaque item :
            - label
            - quantity
            - unit
            - priceHT
            Unités autorisées :
            u, m², ml, m³, kg, h, forfait
            Règles :
            - quantity = 1 si absent
            - priceHT = 0 si absent`;
  }

  private buildPrompt(transcript: string): string {
    return `Transforme cette dictée en JSON devis :"${transcript}"`;
  }

  /**
   * ---------------------------------------------------
   * 4. MAPPING ITEMS
   * ---------------------------------------------------
   */
  private mapAIToItems(raw: AIQuote) {
    return raw.items.map((item) => {
      const unit = normalizeUnit(item.unit);
      const priceHT = Number(item.priceHT ?? 0);

      return {
        label: item.label ?? "Prestation",
        quantity: Number(item.quantity ?? 1),
        unit,
        vatRate: 10,
        unitPrice: { amount: priceHT, currency: "EUR" },
        priceHT,
      };
    });
  }

  /**
   * ---------------------------------------------------
   * 5. VALIDATION
   * ---------------------------------------------------
   */
  private assertItems(items: Quote["items"]): void {
    if (!items.length) {
      throw new Error('Aucune prestation détectée.');
    }
  }

  /**
   * ---------------------------------------------------
   * 6. BUILD DOMAIN OBJECT
   * ---------------------------------------------------
   */
  private buildQuote(raw: AIQuote, items: Quote["items"]) {
    const totalHT = items.reduce((acc, i) => acc + i.quantity * i.priceHT, 0);
    const totalTTC = totalHT * 1.1;

    return {
      id: uuidv4(),
      createdAt: new Date(),
      status: "DRAFT" as const,

      // TODO (refacto DDD) : passer companyId en paramètre au lieu de placeholder
      companyId: "UNKNOWN",

      clientName: raw.clientName ?? "Client à préciser",

      clientAddress: "",
      contactInfo: "",

      projectType: raw.projectType ?? "",
      startDate: "",
      notes: raw.notes ?? "",

      items,

      totalHT: { amount: totalHT, currency: "EUR" },
      totalTTC: { amount: totalTTC, currency: "EUR" },
    };
  }
}
