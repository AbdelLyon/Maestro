import type { QuoteEntity, IQuoteRepository } from '@maestro/domain';

export class InMemoryQuoteRepository implements IQuoteRepository {
  private readonly quotes: QuoteEntity[] = [];

  async save(quote: QuoteEntity): Promise<void> {
    const idx = this.quotes.findIndex((q) => q.id === quote.id);
    if (idx >= 0) {
      this.quotes[idx] = quote;
    } else {
      this.quotes.push(quote);
    }
  }

  async findById(id: string): Promise<QuoteEntity | null> {
    return this.quotes.find((q) => q.id === id) ?? null;
  }

  async findAllByCompany(companyId: string): Promise<QuoteEntity[]> {
    return this.quotes.filter((q) => q.companyId === companyId);
  }
}
