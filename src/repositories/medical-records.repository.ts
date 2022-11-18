import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {MedicalRecords, MedicalRecordsRelations} from '../models';

export class MedicalRecordsRepository extends DefaultCrudRepository<
  MedicalRecords,
  typeof MedicalRecords.prototype.id,
  MedicalRecordsRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(MedicalRecords, dataSource);
  }
}
