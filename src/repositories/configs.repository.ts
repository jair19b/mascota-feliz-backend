import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Configs, ConfigsRelations} from '../models';

export class ConfigsRepository extends DefaultCrudRepository<
  Configs,
  typeof Configs.prototype.id,
  ConfigsRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Configs, dataSource);
  }
}
