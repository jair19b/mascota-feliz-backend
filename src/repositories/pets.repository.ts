import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Pets, PetsRelations} from '../models';

export class PetsRepository extends DefaultCrudRepository<
  Pets,
  typeof Pets.prototype.id,
  PetsRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Pets, dataSource);
  }
}
