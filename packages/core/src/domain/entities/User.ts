import { z } from 'zod';

// Value Objects
export const EmailSchema = z.string().email();
export const FullNameSchema = z.string().min(1);

export type Email = z.infer<typeof EmailSchema>;
export type FullName = z.infer<typeof FullNameSchema>;

// Entity
export class User {
  private _id: string;
  private _companyId: string;
  private _email: Email;
  private _fullName?: FullName;

  constructor(
    id: string,
    companyId: string,
    email: Email,
    fullName?: FullName
  ) {
    this._id = id;
    this._companyId = companyId;
    this._email = email;
    this._fullName = fullName;
  }

  // Getters
  get id(): string { return this._id; }
  get companyId(): string { return this._companyId; }
  get email(): Email { return this._email; }
  get fullName(): FullName | undefined { return this._fullName; }

  // Methods
  updateEmail(email: Email): void {
    this._email = email;
  }

  updateFullName(fullName: FullName): void {
    this._fullName = fullName;
  }

  // Serialization
  toJSON() {
    return {
      id: this._id,
      companyId: this._companyId,
      email: this._email,
      fullName: this._fullName,
    };
  }

  static fromJSON(data: any): User {
    return new User(
      data.id,
      data.companyId,
      data.email,
      data.fullName
    );
  }
}