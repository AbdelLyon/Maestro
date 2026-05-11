import { z } from 'zod';

// Value Objects
export const GrantConditionsSchema = z.any(); // JSON conditions

export type GrantConditions = z.infer<typeof GrantConditionsSchema>;

// Entity
export class GrantRule {
  private _id: string;
  private _name: string;
  private _description?: string;
  private _conditions: GrantConditions;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    conditions: GrantConditions,
    description?: string,
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._conditions = conditions;
    this._updatedAt = updatedAt;
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string | undefined { return this._description; }
  get conditions(): GrantConditions { return { ...this._conditions }; }
  get updatedAt(): Date { return this._updatedAt; }

  updateName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateConditions(conditions: GrantConditions): void {
    this._conditions = { ...conditions };
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      conditions: this._conditions,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data: any): GrantRule {
    return new GrantRule(
      data.id,
      data.name,
      data.conditions,
      data.description,
      new Date(data.updatedAt)
    );
  }
}