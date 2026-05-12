import type { QuoteEntity, IQuoteRepository } from '@maestro/domain';
import { prisma } from '@maestro/database';
import { toDomain, toCreateInput } from '../mappers/QuoteMapper';

export class PrismaQuoteRepository implements IQuoteRepository {
  async save(quote: QuoteEntity): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.quote.create({ data: toCreateInput(quote) as any, include: { items: true } });
  }

  async findById(id: string): Promise<QuoteEntity | null> {
    const row = await prisma.quote.findUnique({ where: { id }, include: { items: true } });
    if (!row) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toDomain(row as any);
  }

  async findAllByCompany(companyId: string): Promise<QuoteEntity[]> {
    const rows = await prisma.quote.findMany({
      where: { company_id: companyId },
      include: { items: true },
      orderBy: { created_at: 'desc' },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => toDomain(row));
  }
}
