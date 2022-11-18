import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Users} from './users.model';

@model()
export class Orders extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    default: "pending",
  })
  state?: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'array',
    itemType: 'object',
  })
  products?: object[];

  @belongsTo(() => Users)
  clientId: string;

  constructor(data?: Partial<Orders>) {
    super(data);
  }
}

export interface OrdersRelations {
  // describe navigational properties here
}

export type OrdersWithRelations = Orders & OrdersRelations;
