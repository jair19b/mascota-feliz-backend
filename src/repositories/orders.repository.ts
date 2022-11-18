import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Orders, OrdersRelations, Users} from '../models';
import {UsersRepository} from './users.repository';

export class OrdersRepository extends DefaultCrudRepository<
  Orders,
  typeof Orders.prototype.id,
  OrdersRelations
> {

  public readonly client: BelongsToAccessor<Users, typeof Orders.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Orders, dataSource);
    this.client = this.createBelongsToAccessorFor('client', usersRepositoryGetter,);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
  }
}
