import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Pets, PetsRelations, Users, MedicalRecords} from '../models';
import {UsersRepository} from './users.repository';
import {MedicalRecordsRepository} from './medical-records.repository';

export class PetsRepository extends DefaultCrudRepository<
  Pets,
  typeof Pets.prototype.id,
  PetsRelations
> {

  public readonly owner: BelongsToAccessor<Users, typeof Pets.prototype.id>;

  public readonly medicalRecord: HasOneRepositoryFactory<MedicalRecords, typeof Pets.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>, @repository.getter('MedicalRecordsRepository') protected medicalRecordsRepositoryGetter: Getter<MedicalRecordsRepository>,
  ) {
    super(Pets, dataSource);
    this.medicalRecord = this.createHasOneRepositoryFactoryFor('medicalRecord', medicalRecordsRepositoryGetter);
    this.registerInclusionResolver('medicalRecord', this.medicalRecord.inclusionResolver);
    this.owner = this.createBelongsToAccessorFor('owner', usersRepositoryGetter,);
    this.registerInclusionResolver('owner', this.owner.inclusionResolver);
  }
}
