import { z } from 'zod';

export const LocationSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type Location = z.infer<typeof LocationSchema>;

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
    labelRGE = false,
    speciality?: string,
    location?: Location,
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._siret = siret;
    this._labelRGE = labelRGE;
    this._speciality = speciality;
    this._location = location;
    this._createdAt = createdAt;
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get siret(): string { return this._siret; }
  get labelRGE(): boolean { return this._labelRGE; }
  get speciality(): string | undefined { return this._speciality; }
  get location(): Location | undefined { return this._location; }
  get createdAt(): Date { return this._createdAt; }

  updateName(name: string): void { this._name = name; }
  updateSpeciality(speciality: string): void { this._speciality = speciality; }
  updateLocation(location: Location): void { this._location = location; }

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(data: any): Company {
    return new Company(
      data.id,
      data.name,
      data.siret,
      data.labelRGE,
      data.speciality,
      data.location,
      new Date(data.createdAt),
    );
  }
}
