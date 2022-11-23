import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Locations} from './locations.model';
import {Orders} from './orders.model';
import {Pets} from './pets.model';
import {Requests} from './requests.model';

@model()
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    default: 'unverified',
  })
  status?: string;

  @property({
    type: 'string',
    required: true,
  })
  cedula: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  birthday: string;

  @property({
    type: 'string',
    required: true,
  })
  gender: string;

  @property({
    type: 'string',
    required: true,
  })
  cellphone: string;

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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    default: 'cliente',
  })
  rol?: string;

  @property({
    type: 'string',
  })
  activationKey?: string;

  @belongsTo(() => Locations)
  locationId: string;

  @hasMany(() => Pets, {keyTo: 'ownerId'})
  pets: Pets[];

  @hasMany(() => Requests, {keyTo: 'ownerId'})
  requests: Requests[];

  @hasMany(() => Orders, {keyTo: 'clientId'})
  orders: Orders[];

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
