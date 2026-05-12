import { z } from 'zod';

export const CashFlowTypeSchema = z.enum(['INCOME', 'EXPENSE']);
export type CashFlowType = z.infer<typeof CashFlowTypeSchema>;

export class CashFlowEvent {
  private _id: string;
  private _companyId: string;
  private _amount: number;
  private _date: Date;
  private _type: CashFlowType;
  private _isPredicted: boolean;

  constructor(
    id: string,
    companyId: string,
    amount: number,
    date: Date,
    type: CashFlowType,
    isPredicted = false,
  ) {
    this._id = id;
    this._companyId = companyId;
    this._amount = amount;
    this._date = date;
    this._type = type;
    this._isPredicted = isPredicted;
  }

  get id(): string { return this._id; }
  get companyId(): string { return this._companyId; }
  get amount(): number { return this._amount; }
  get date(): Date { return this._date; }
  get type(): CashFlowType { return this._type; }
  get isPredicted(): boolean { return this._isPredicted; }

  updateAmount(amount: number): void { this._amount = amount; }
  updateDate(date: Date): void { this._date = date; }
  markAsPredicted(): void { this._isPredicted = true; }
  markAsActual(): void { this._isPredicted = false; }

  toJSON() {
    return {
      id: this._id,
      companyId: this._companyId,
      amount: this._amount,
      date: this._date,
      type: this._type,
      isPredicted: this._isPredicted,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(data: any): CashFlowEvent {
    return new CashFlowEvent(
      data.id, data.companyId, data.amount,
      new Date(data.date), data.type, data.isPredicted,
    );
  }
}
