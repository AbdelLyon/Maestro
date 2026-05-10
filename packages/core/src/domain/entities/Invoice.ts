import { z } from 'zod';

// Value Objects
export const InvoiceStatusSchema = z.enum(['PENDING', 'PAID', 'OVERDUE']);

export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

// Entity
export class Invoice {
  private _id: string;
  private _quoteId: string;
  private _dueDate: Date;
  private _status: InvoiceStatus;

  constructor(
    id: string,
    quoteId: string,
    dueDate: Date,
    status: InvoiceStatus = 'PENDING'
  ) {
    this._id = id;
    this._quoteId = quoteId;
    this._dueDate = dueDate;
    this._status = status;
  }

  get id(): string { return this._id; }
  get quoteId(): string { return this._quoteId; }
  get dueDate(): Date { return this._dueDate; }
  get status(): InvoiceStatus { return this._status; }

  updateStatus(status: InvoiceStatus): void {
    this._status = status;
  }

  updateDueDate(dueDate: Date): void {
    this._dueDate = dueDate;
  }

  isOverdue(): boolean {
    return this._status === 'PENDING' && new Date() > this._dueDate;
  }

  toJSON() {
    return {
      id: this._id,
      quoteId: this._quoteId,
      dueDate: this._dueDate,
      status: this._status,
    };
  }

  static fromJSON(data: any): Invoice {
    return new Invoice(
      data.id,
      data.quoteId,
      new Date(data.dueDate),
      data.status
    );
  }
}