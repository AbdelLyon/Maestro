import type { QuoteEntity } from "../entities/Quote";

export interface IQuoteRepository {
  save(quote: QuoteEntity): Promise<void>;
  findById(id: string): Promise<QuoteEntity | null>;
  findAllByCompany(companyId: string): Promise<QuoteEntity[]>;
}
