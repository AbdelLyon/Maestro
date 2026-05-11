import { z } from 'zod';

// Value Objects
export const UnitEnum = z.enum([
  'u',
  'm²',
  'ml',
  'm³',
  'kg',
  'h',
  'forfait',
]).default('u');

export const MoneySchema = z.object({
  amount: z.number(),
  currency: z.string().default('EUR'),
});

export const QuoteStatusSchema = z.enum(['DRAFT', 'SENT', 'SIGNED', 'PAID', 'REJECTED']);

export type Unit = z.infer<typeof UnitEnum>;
export type Money = z.infer<typeof MoneySchema>;
export type QuoteStatus = z.infer<typeof QuoteStatusSchema>;

// Schemas for backward compatibility
export const QuoteItemSchema = z.object({
  label: z.string().min(2, 'La désignation est requise'),
  quantity: z.coerce.number().min(0).default(1),
  unit: UnitEnum,
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

// Value Object for QuoteItem
export class QuoteItem {
  private _label: string;
  private _quantity: number;
  private _unit: Unit;
  private _unitPrice: Money;
  private _vatRate: number;

  constructor(
    label: string,
    quantity: number,
    unit: Unit,
    unitPrice: Money,
    vatRate: number
  ) {
    this._label = label;
    this._quantity = quantity;
    this._unit = unit;
    this._unitPrice = unitPrice;
    this._vatRate = vatRate;
  }

  get label(): string { return this._label; }
  get quantity(): number { return this._quantity; }
  get unit(): Unit { return this._unit; }
  get unitPrice(): Money { return this._unitPrice; }
  get vatRate(): number { return this._vatRate; }

  // Backward compatibility
  get priceHT(): number { return this._unitPrice.amount; }

  get totalHT(): number {
    return this._quantity * this._unitPrice.amount;
  }

  get totalTTC(): number {
    return this.totalHT * (1 + this._vatRate / 100);
  }

  toJSON() {
    return {
      label: this._label,
      quantity: this._quantity,
      unit: this._unit,
      unitPrice: this._unitPrice,
      vatRate: this._vatRate,
    };
  }

  static fromJSON(data: unknown): QuoteItem {
    const parsed = QuoteItemSchema.parse(data);
    return new QuoteItem(
      parsed.label,
      parsed.quantity,
      parsed.unit,
      parsed.unitPrice,
      parsed.vatRate,
    );
  }
}

// Entity
export class QuoteEntity {
  public readonly id: string;
  public readonly companyId: string;
  public readonly clientName: string;
  public readonly clientAddress?: string;
  public readonly contactInfo?: string;
  public readonly projectType?: string;
  public readonly startDate?: string;
  public readonly notes?: string;
  public readonly status: QuoteStatus;
  public readonly totalHT: number;
  public readonly totalTTC: number;
  public readonly createdAt: Date;
  public readonly items: QuoteItem[];

  constructor(
    id: string,
    companyId: string,
    clientName: string,
    items: QuoteItem[] = [],
    status: QuoteStatus = 'DRAFT',
    totalHT?: number,
    totalTTC?: number,
    createdAt: Date = new Date(),
    clientAddress?: string,
    contactInfo?: string,
    projectType?: string,
    startDate?: string,
    notes?: string
  ) {
    this.id = id;
    this.companyId = companyId;
    this.clientName = clientName;
    this.clientAddress = clientAddress;
    this.contactInfo = contactInfo;
    this.projectType = projectType;
    this.startDate = startDate;
    this.notes = notes;
    this.status = status;
    this.items = items;
    this.createdAt = createdAt;
    this.totalHT = totalHT || this.calculateTotalHT();
    this.totalTTC = totalTTC || this.calculateTotalTTC();
  }

  // Methods
  addItem(item: QuoteItem): QuoteEntity {
    const newItems = [...this.items, item];
    return new QuoteEntity(
      this.id,
      this.companyId,
      this.clientName,
      newItems,
      this.status,
      this.calculateTotalHT(newItems),
      this.calculateTotalTTC(newItems),
      this.createdAt,
      this.clientAddress,
      this.contactInfo,
      this.projectType,
      this.startDate,
      this.notes
    );
  }

  updateStatus(status: QuoteStatus): QuoteEntity {
    return new QuoteEntity(
      this.id,
      this.companyId,
      this.clientName,
      this.items,
      status,
      this.totalHT,
      this.totalTTC,
      this.createdAt,
      this.clientAddress,
      this.contactInfo,
      this.projectType,
      this.startDate,
      this.notes
    );
  }

  private calculateTotalHT(items: QuoteItem[] = this.items): number {
    return items.reduce((sum, item) => sum + item.totalHT, 0);
  }

  private calculateTotalTTC(items: QuoteItem[] = this.items): number {
    return items.reduce((sum, item) => sum + item.totalTTC, 0);
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
      items: this.items.map(item => item.toJSON()),
    };
  }

  static fromJSON(data: unknown): QuoteEntity {
    const parsed = QuoteSchema.parse(data);

    const items = parsed.items.map((itemData) => QuoteItem.fromJSON(itemData));

    return new QuoteEntity(
      parsed.id ?? crypto.randomUUID(),
      parsed.companyId,
      parsed.clientName,
      items,
      parsed.status,
      parsed.totalHT.amount,
      parsed.totalTTC.amount,
      parsed.createdAt,
      parsed.clientAddress,
      parsed.contactInfo,
      parsed.projectType,
      parsed.startDate,
      parsed.notes,
    );
  }
}
