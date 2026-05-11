import type { QuoteEntity } from "../../domain/entities/Quote";
import type { IQuoteRepository } from "../../domain/interfaces/IQuoteRepository";

import { PrismaClient } from "@prisma/client";

import { QuoteEntity as QuoteEntityDomain } from "../../domain/entities/Quote";

type PrismaDecimalLike = unknown;

type PrismaQuoteItemCreateInput = {
  label: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
};

type PrismaQuoteCreateInput = {
  company_id: string;
  client_name: string;
  status: string;
  total_ht: PrismaDecimalLike;
  total_ttc: PrismaDecimalLike;
  items: {
    create: PrismaQuoteItemCreateInput[];
  };
};

export class PrismaQuoteRepository implements IQuoteRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient ?? new PrismaClient();
  }

  async save(quote: QuoteEntity): Promise<void> {
    const quoteJson = quote.toJSON();

    const createInput: PrismaQuoteCreateInput = {
      company_id: quoteJson.companyId,
      client_name: quoteJson.clientName,
      status: quoteJson.status,
      total_ht: quoteJson.totalHT,
      total_ttc: quoteJson.totalTTC,
      items: {
        create: quoteJson.items.map((item) => ({
          label: item.label,
          quantity: item.quantity,
          unit_price: item.unitPrice.amount,
          vat_rate: item.vatRate,
        })),
      },
    };

    await this.prisma.quote.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: createInput as any,
      include: { items: true },
    });
  }

  async findById(id: string): Promise<QuoteEntity | null> {
    const found = await this.prisma.quote.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!found) return null;

    return this.toDomainEntity(found);
  }

  async findAllByCompany(companyId: string): Promise<QuoteEntity[]> {
    const found = await this.prisma.quote.findMany({
      where: { company_id: companyId },
      include: { items: true },
      orderBy: { created_at: "desc" },
    });

    return found.map((row: unknown) => this.toDomainEntity(row));
  }

  private toDomainEntity(row: unknown): QuoteEntity {
    // On évite de dépendre des types Prisma ici : le but est d’obtenir un domaine valide via QuoteSchema/parse.
    const r = row as {
      id: string;
      company_id: string;
      client_name: string;
      status: string;
      total_ht: { toNumber?: () => number } | number | string;
      total_ttc: { toNumber?: () => number } | number | string;
      created_at: Date | string;
      clientAddress?: string | null;
      contactInfo?: string | null;
      projectType?: string | null;
      startDate?: string | null;
      notes?: string | null;
      items: Array<{
        label: string;
        quantity: number;
        unit_price: { toNumber?: () => number } | number | string;
        vat_rate: number;
      }>;
    };

    const totalHT = this.decimalToNumber(r.total_ht);
    const totalTTC = this.decimalToNumber(r.total_ttc);

    const createdAt =
      r.created_at instanceof Date ? r.created_at : new Date(r.created_at);

    return QuoteEntityDomain.fromJSON({
      id: r.id,
      companyId: r.company_id,
      clientName: r.client_name,
      status: r.status,
      createdAt,
      items: r.items.map((i) => ({
        label: i.label,
        quantity: i.quantity,
        unit: "u",
        unitPrice: {
          amount: this.decimalToNumber(i.unit_price),
          currency: "EUR",
        },
        vatRate: i.vat_rate,
        priceHT: this.decimalToNumber(i.unit_price) * i.quantity,
      })),
      totalHT: { amount: totalHT, currency: "EUR" },
      totalTTC: { amount: totalTTC, currency: "EUR" },

      // Champs non présents dans le schéma Prisma actuel : fallback domaine
      clientAddress: "",
      contactInfo: "",
      projectType: "",
      startDate: "",
      notes: "",
    });
  }

  private decimalToNumber(
    value: { toNumber?: () => number } | number | string,
  ): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value);
    if (typeof value?.toNumber === "function") return value.toNumber();
    return Number(value);
  }
}
