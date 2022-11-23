import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Configs extends Entity {
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
  type: string;

  @property({
    type: 'boolean',
    required: true,
  })
  active: boolean;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  @property({
    type: 'string',
  })
  updatedAt?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Configs>) {
    super(data);
  }
}

export interface ConfigsRelations {
  // describe navigational properties here
}

export type ConfigsWithRelations = Configs & ConfigsRelations;
