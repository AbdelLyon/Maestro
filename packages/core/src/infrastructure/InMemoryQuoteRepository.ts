import { Quote } from '../domain/entities/Quote';
import { IQuoteRepository } from '../domain/interfaces/IQuoteRepository';
import { singleton } from "tsyringe";

@singleton()
export class InMemoryQuoteRepository implements IQuoteRepository {
  private quotes: Quote[] = [];

  async save(quote: Quote): Promise<void> {
    this.quotes.push(quote);
    console.log("🛠️ Devis sauvegardé en mémoire :", quote);
  }

  async findById(id: string): Promise<Quote | null> {
    return this.quotes.find(q => q.id === id) || null;
  }

  async findAllByCompany(companyId: string): Promise<Quote[]> {
    return this.quotes;
  }
}