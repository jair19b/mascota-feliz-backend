import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Users, UsersRelations, Locations, Pets, Requests, Orders} from '../models';
import {LocationsRepository} from './locations.repository';
import {PetsRepository} from './pets.repository';
import {RequestsRepository} from './requests.repository';
import {OrdersRepository} from './orders.repository';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {

  public readonly location: BelongsToAccessor<Locations, typeof Users.prototype.id>;

  public readonly pets: HasManyRepositoryFactory<Pets, typeof Users.prototype.id>;

  public readonly requests: HasManyRepositoryFactory<Requests, typeof Users.prototype.id>;

  public readonly orders: HasManyRepositoryFactory<Orders, typeof Users.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('LocationsRepository') protected locationsRepositoryGetter: Getter<LocationsRepository>, @repository.getter('PetsRepository') protected petsRepositoryGetter: Getter<PetsRepository>, @repository.getter('RequestsRepository') protected requestsRepositoryGetter: Getter<RequestsRepository>, @repository.getter('OrdersRepository') protected ordersRepositoryGetter: Getter<OrdersRepository>,
  ) {
    super(Users, dataSource);
    this.orders = this.createHasManyRepositoryFactoryFor('orders', ordersRepositoryGetter,);
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestsRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
    this.pets = this.createHasManyRepositoryFactoryFor('pets', petsRepositoryGetter,);
    this.registerInclusionResolver('pets', this.pets.inclusionResolver);
    this.location = this.createBelongsToAccessorFor('location', locationsRepositoryGetter,);
    this.registerInclusionResolver('location', this.location.inclusionResolver);
  }
}
