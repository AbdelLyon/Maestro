import { z } from 'zod';
import { MoneySchema } from '../../shared/value-objects/Money';

// ─── Value Objects ────────────────────────────────────────────────────────────

export const UnitSchema = z.enum(['u', 'm²', 'ml', 'm³', 'kg', 'h', 'forfait']).default('u');
export const QuoteStatusSchema = z.enum(['DRAFT', 'SENT', 'SIGNED', 'PAID', 'REJECTED']);

export type Unit = z.infer<typeof UnitSchema>;
export type QuoteStatus = z.infer<typeof QuoteStatusSchema>;

// ─── Schemas Zod (validation domaine) ─────────────────────────────────────────

export const QuoteItemSchema = z.object({
  label: z.string().min(2, 'La désignation est requise'),
  quantity: z.coerce.number().min(0).default(1),
  unit: UnitSchema,
  unitPrice: MoneySchema,
  vatRate: z.number().default(10),
  priceHT: z.number(),
});

export const QuoteSchema = z.object({
  id: z.string().uuid().optional(),
  companyId: z.string(),
  createdAt: z.date().default(() => new Date()),
  status: QuoteStatusSchema.default('DRAFT'),
  clientName: z.string().min(2, 'Nom du client requis'),
  clientAddress: z.string().optional(),
  contactInfo: z.string().optional(),
  projectType: z.string().optional(),
  startDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(QuoteItemSchema),
  totalHT: MoneySchema,
  totalTTC: MoneySchema,
});

export type Quote = z.infer<typeof QuoteSchema>;
export type QuoteItem = z.infer<typeof QuoteItemSchema>;

// ─── Value Object QuoteItem ───────────────────────────────────────────────────

export class QuoteItemVO {
  readonly label: string;
  readonly quantity: number;
  readonly unit: Unit;
  readonly unitPrice: { amount: number; currency: string };
  readonly vatRate: number;

  constructor(data: QuoteItem) {
    const parsed = QuoteItemSchema.parse(data);
    this.label = parsed.label;
    this.quantity = parsed.quantity;
    this.unit = parsed.unit;
    this.unitPrice = parsed.unitPrice;
    this.vatRate = parsed.vatRate;
  }

  get priceHT(): number {
    return this.unitPrice.amount;
  }

  get totalHT(): number {
    return this.quantity * this.unitPrice.amount;
  }

  get totalTTC(): number {
    return this.totalHT * (1 + this.vatRate / 100);
  }

  toJSON(): QuoteItem {
    return {
      label: this.label,
      quantity: this.quantity,
      unit: this.unit,
      unitPrice: this.unitPrice,
      vatRate: this.vatRate,
      priceHT: this.priceHT,
    };
  }

  static fromJSON(data: unknown): QuoteItemVO {
    return new QuoteItemVO(QuoteItemSchema.parse(data));
  }
}

// ─── Aggregate Root QuoteEntity ───────────────────────────────────────────────

export class QuoteEntity {
  readonly id: string;
  readonly companyId: string;
  readonly clientName: string;
  readonly clientAddress?: string;
  readonly contactInfo?: string;
  readonly projectType?: string;
  readonly startDate?: string;
  readonly notes?: string;
  readonly status: QuoteStatus;
  readonly totalHT: number;
  readonly totalTTC: number;
  readonly createdAt: Date;
  readonly items: QuoteItemVO[];

  constructor(props: {
    id: string;
    companyId: string;
    clientName: string;
    items?: QuoteItemVO[];
    status?: QuoteStatus;
    totalHT?: number;
    totalTTC?: number;
    createdAt?: Date;
    clientAddress?: string;
    contactInfo?: string;
    projectType?: string;
    startDate?: string;
    notes?: string;
  }) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.clientName = props.clientName;
    this.clientAddress = props.clientAddress;
    this.contactInfo = props.contactInfo;
    this.projectType = props.projectType;
    this.startDate = props.startDate;
    this.notes = props.notes;
    this.status = props.status ?? 'DRAFT';
    this.items = props.items ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.totalHT = props.totalHT ?? this.calculateTotalHT();
    this.totalTTC = props.totalTTC ?? this.calculateTotalTTC();
  }

  addItem(item: QuoteItemVO): QuoteEntity {
    const newItems = [...this.items, item];
    return new QuoteEntity({
      ...this.toProps(),
      items: newItems,
      totalHT: QuoteEntity.sumTotalHT(newItems),
      totalTTC: QuoteEntity.sumTotalTTC(newItems),
    });
  }

  updateStatus(status: QuoteStatus): QuoteEntity {
    return new QuoteEntity({ ...this.toProps(), status });
  }

  private calculateTotalHT(): number {
    return QuoteEntity.sumTotalHT(this.items);
  }

  private calculateTotalTTC(): number {
    return QuoteEntity.sumTotalTTC(this.items);
  }

  private static sumTotalHT(items: QuoteItemVO[]): number {
    return items.reduce((sum, item) => sum + item.totalHT, 0);
  }

  private static sumTotalTTC(items: QuoteItemVO[]): number {
    return items.reduce((sum, item) => sum + item.totalTTC, 0);
  }

  private toProps() {
    return {
      id: this.id,
      companyId: this.companyId,
      clientName: this.clientName,
      clientAddress: this.clientAddress,
      contactInfo: this.contactInfo,
      projectType: this.projectType,
      startDate: this.startDate,
      notes: this.notes,
      status: this.status,
      items: this.items,
      totalHT: this.totalHT,
      totalTTC: this.totalTTC,
      createdAt: this.createdAt,
    };
  }

  toJSON() {
    return {
      id: this.id,
      companyId: this.companyId,
      clientName: this.clientName,
      clientAddress: this.clientAddress,
      contactInfo: this.contactInfo,
      projectType: this.projectType,
      startDate: this.startDate,
      notes: this.notes,
      status: this.status,
      totalHT: this.totalHT,
      totalTTC: this.totalTTC,
      createdAt: this.createdAt,
      items: this.items.map((item) => item.toJSON()),
    };
  }

  static fromJSON(data: unknown): QuoteEntity {
    const parsed = QuoteSchema.parse(data);
    const items = parsed.items.map((i) => QuoteItemVO.fromJSON(i));

    return new QuoteEntity({
      id: parsed.id ?? crypto.randomUUID(),
      companyId: parsed.companyId,
      clientName: parsed.clientName,
      clientAddress: parsed.clientAddress,
      contactInfo: parsed.contactInfo,
      projectType: parsed.projectType,
      startDate: parsed.startDate,
      notes: parsed.notes,
      status: parsed.status,
      items,
      totalHT: parsed.totalHT.amount,
      totalTTC: parsed.totalTTC.amount,
      createdAt: parsed.createdAt,
    });
  }
}
