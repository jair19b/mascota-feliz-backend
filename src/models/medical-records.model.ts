import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class MedicalRecords extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  size: string;

  @property({
    type: 'string',
    required: true,
  })
  specie: string;

  @property({
    type: 'string',
    required: true,
  })
  sex: string;

  @property({
    type: 'string',
  })
  birthday?: string;

  @property({
    type: 'date',
  })
  lastDeworming?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  diseases?: object[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  vaccines?: object[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  homeVisits?: object[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MedicalRecords>) {
    super(data);
  }
}

export interface MedicalRecordsRelations {
  // describe navigational properties here
}

export type MedicalRecordsWithRelations = MedicalRecords & MedicalRecordsRelations;
