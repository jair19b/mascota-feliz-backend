import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Requests, RequestsRelations} from '../models';

export class RequestsRepository extends DefaultCrudRepository<
  Requests,
  typeof Requests.prototype.id,
  RequestsRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Requests, dataSource);
  }
}
