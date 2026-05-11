import { z } from 'zod';

// Value Objects
export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export const LocationSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
export type Location = z.infer<typeof LocationSchema>;

// Entity
export class Company {
  private _id: string;
  private _name: string;
  private _siret: string;
  private _labelRGE: boolean;
  private _speciality?: string;
  private _location?: Location;
  private _createdAt: Date;

  constructor(
    id: string,
    name: string,
    siret: string,
    labelRGE: boolean = false,
    speciality?: string,
    location?: Location,
    createdAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._siret = siret;
    this._labelRGE = labelRGE;
    this._speciality = speciality;
    this._location = location;
    this._createdAt = createdAt;
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get siret(): string { return this._siret; }
  get labelRGE(): boolean { return this._labelRGE; }
  get speciality(): string | undefined { return this._speciality; }
  get location(): Location | undefined { return this._location; }
  get createdAt(): Date { return this._createdAt; }

  // Methods
  updateName(name: string): void {
    this._name = name;
  }

  updateSpeciality(speciality: string): void {
    this._speciality = speciality;
  }

  updateLocation(location: Location): void {
    this._location = location;
  }

  // Serialization
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      siret: this._siret,
      labelRGE: this._labelRGE,
      speciality: this._speciality,
      location: this._location,
      createdAt: this._createdAt,
    };
  }

  static fromJSON(data: any): Company {
    return new Company(
      data.id,
      data.name,
      data.siret,
      data.labelRGE,
      data.speciality,
      data.location,
      new Date(data.createdAt)
    );
  }
}