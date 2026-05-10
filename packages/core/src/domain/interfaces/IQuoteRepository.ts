import { Quote } from '../..';

export interface IQuoteRepository {
  save(quote: Quote): Promise<void>;
  findById(id: string): Promise<Quote | null>;
  findAllByCompany(companyId: string): Promise<Quote[]>;
}

export const dummy = 'dummy';