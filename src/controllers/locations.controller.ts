import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {Locations} from '../models';
import {LocationsRepository} from '../repositories';

export class LocationsController {
  constructor(
    @repository(LocationsRepository)
    public locationsRepository: LocationsRepository,
  ) {}

  // @authenticate('Admin')
  @post('/sede')
  @response(200, {
    description: 'Locations model instance',
    content: {'application/json': {schema: getModelSchemaRef(Locations)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Locations, {
            title: 'NewLocations',
            exclude: ['id'],
          }),
        },
      },
    })
    locations: Omit<Locations, 'id'>,
  ): Promise<Locations> {
    return this.locationsRepository.create(locations);
  }

  @authenticate('Admin')
  @get('/sede/count')
  @response(200, {
    description: 'Locations model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Locations) where?: Where<Locations>): Promise<Count> {
    return this.locationsRepository.count(where);
  }

  // @authenticate('Admin')
  @get('/sede')
  @response(200, {
    description: 'Array of Locations model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Locations, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Locations) filter?: Filter<Locations>): Promise<Locations[]> {
    return this.locationsRepository.find(filter);
  }

  @authenticate('Admin')
  @patch('/sede')
  @response(200, {
    description: 'Locations PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Locations, {partial: true}),
        },
      },
    })
    locations: Locations,
    @param.where(Locations) where?: Where<Locations>,
  ): Promise<Count> {
    return this.locationsRepository.updateAll(locations, where);
  }

  @authenticate('Admin')
  @get('/sede/{id}')
  @response(200, {
    description: 'Locations model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Locations, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Locations, {exclude: 'where'}) filter?: FilterExcludingWhere<Locations>,
  ): Promise<Locations> {
    return this.locationsRepository.findById(id, filter);
  }

  @authenticate('Admin')
  @patch('/sede/{id}')
  @response(204, {
    description: 'Locations PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Locations, {partial: true}),
        },
      },
    })
    locations: Locations,
  ): Promise<void> {
    await this.locationsRepository.updateById(id, locations);
  }

  @authenticate('Admin')
  @put('/sede/{id}')
  @response(204, {
    description: 'Locations PUT success',
  })
  async replaceById(@param.path.string('id') id: string, @requestBody() locations: Locations): Promise<void> {
    await this.locationsRepository.replaceById(id, locations);
  }

  @authenticate('Admin')
  @del('/sede/{id}')
  @response(204, {
    description: 'Locations DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.locationsRepository.deleteById(id);
  }
}
