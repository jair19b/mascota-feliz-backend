import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Locations, LocationsRelations, Users} from '../models';
import {UsersRepository} from './users.repository';

export class LocationsRepository extends DefaultCrudRepository<
  Locations,
  typeof Locations.prototype.id,
  LocationsRelations
> {

  public readonly users: HasManyRepositoryFactory<Users, typeof Locations.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Locations, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', usersRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}
