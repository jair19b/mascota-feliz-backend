import {Entity, model, property} from '@loopback/repository';

@model()
export class Requests extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  city: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    default: 'pending',
  })
  state?: string;

  @property({
    type: 'string',
    required: false,
  })
  details?: string;

  constructor(data?: Partial<Requests>) {
    super(data);
  }
}

export interface RequestsRelations {
  // describe navigational properties here
}

export type RequestsWithRelations = Requests & RequestsRelations;
