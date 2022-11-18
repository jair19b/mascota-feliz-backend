import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {MedicalRecords, MedicalRecordsRelations, Pets} from '../models';
import {PetsRepository} from './pets.repository';

export class MedicalRecordsRepository extends DefaultCrudRepository<
  MedicalRecords,
  typeof MedicalRecords.prototype.id,
  MedicalRecordsRelations
> {

  public readonly pet: BelongsToAccessor<Pets, typeof MedicalRecords.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('PetsRepository') protected petsRepositoryGetter: Getter<PetsRepository>,
  ) {
    super(MedicalRecords, dataSource);
    this.pet = this.createBelongsToAccessorFor('pet', petsRepositoryGetter,);
    this.registerInclusionResolver('pet', this.pet.inclusionResolver);
  }
}
