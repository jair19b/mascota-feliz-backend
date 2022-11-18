import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Users} from './users.model';
import {MedicalRecords} from './medical-records.model';

@model()
export class Pets extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    default: 'pending',
  })
  status?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;

  @property({
    type: 'string',
    required: true,
  })
  breed: string;

  @property({
    type: 'string',
    required: true,
  })
  color: string;

  @property({
    type: 'string',
  })
  photo?: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @belongsTo(() => Users)
  ownerId: string;

  @hasOne(() => MedicalRecords, {keyTo: 'id'})
  medicalRecord: MedicalRecords;

  constructor(data?: Partial<Pets>) {
    super(data);
  }
}

export interface PetsRelations {
  // describe navigational properties here
}

export type PetsWithRelations = Pets & PetsRelations;
