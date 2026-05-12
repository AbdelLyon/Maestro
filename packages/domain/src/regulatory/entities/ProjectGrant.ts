import type { Money } from '../../shared/value-objects/Money';

export class ProjectGrant {
  private _id: string;
  private _quoteId: string;
  private _grantRuleId: string;
  private _estimatedAmount: Money;

  constructor(id: string, quoteId: string, grantRuleId: string, estimatedAmount: Money) {
    this._id = id;
    this._quoteId = quoteId;
    this._grantRuleId = grantRuleId;
    this._estimatedAmount = estimatedAmount;
  }

  get id(): string { return this._id; }
  get quoteId(): string { return this._quoteId; }
  get grantRuleId(): string { return this._grantRuleId; }
  get estimatedAmount(): Money { return { ...this._estimatedAmount }; }

  updateEstimatedAmount(amount: Money): void { this._estimatedAmount = { ...amount }; }

  toJSON() {
    return { id: this._id, quoteId: this._quoteId, grantRuleId: this._grantRuleId, estimatedAmount: this._estimatedAmount };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(data: any): ProjectGrant {
    return new ProjectGrant(data.id, data.quoteId, data.grantRuleId, data.estimatedAmount);
  }
}
