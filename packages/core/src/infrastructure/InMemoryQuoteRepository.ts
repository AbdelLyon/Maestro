import type { QuoteEntity } from '../domain/entities/Quote';
import { IQuoteRepository } from '../domain/interfaces/IQuoteRepository';
import { singleton } from "tsyringe";

@singleton()
export class InMemoryQuoteRepository implements IQuoteRepository {
  private quotes: QuoteEntity[] = [];

  async save(quote: QuoteEntity): Promise<void> {
    this.quotes.push(quote);
    console.log("🛠️ Devis sauvegardé en mémoire :", quote);
  }

  async findById(id: string): Promise<QuoteEntity | null> {
    return this.quotes.find(q => q.id === id) || null;
  }

  async findAllByCompany(companyId: string): Promise<QuoteEntity[]> {
    return this.quotes;
  }
}