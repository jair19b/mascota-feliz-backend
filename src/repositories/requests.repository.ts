import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Requests, RequestsRelations, Users, Pets} from '../models';
import {UsersRepository} from './users.repository';
import {PetsRepository} from './pets.repository';

export class RequestsRepository extends DefaultCrudRepository<
  Requests,
  typeof Requests.prototype.id,
  RequestsRelations
> {

  public readonly owner: BelongsToAccessor<Users, typeof Requests.prototype.id>;

  public readonly pet: HasOneRepositoryFactory<Pets, typeof Requests.prototype.id>;

  public readonly advisor: BelongsToAccessor<Users, typeof Requests.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>, @repository.getter('PetsRepository') protected petsRepositoryGetter: Getter<PetsRepository>,
  ) {
    super(Requests, dataSource);
    this.advisor = this.createBelongsToAccessorFor('advisor', usersRepositoryGetter,);
    this.registerInclusionResolver('advisor', this.advisor.inclusionResolver);
    this.pet = this.createHasOneRepositoryFactoryFor('pet', petsRepositoryGetter);
    this.registerInclusionResolver('pet', this.pet.inclusionResolver);
    this.owner = this.createBelongsToAccessorFor('owner', usersRepositoryGetter,);
    this.registerInclusionResolver('owner', this.owner.inclusionResolver);
  }
}
