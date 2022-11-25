import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {Pets} from './pets.model';
import {Users} from './users.model';

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
    type: 'string',
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

  @property({
    type: 'string',
    required: false,
  })
  updatedAt?: string;

  @belongsTo(() => Users)
  ownerId: string;

  @hasOne(() => Pets, {keyTo: 'id'})
  pet: Pets;

  @belongsTo(() => Users)
  advisorId: string;

  constructor(data?: Partial<Requests>) {
    super(data);
  }
}

export interface RequestsRelations {
  // describe navigational properties here
  owner: Users;
}

export type RequestsWithRelations = Requests & RequestsRelations;
