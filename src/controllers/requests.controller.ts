import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {RequestRevision} from '../interfaces';
import {Requests} from '../models';
import {RequestsRepository} from '../repositories';
import {PetsRepository} from './../repositories/pets.repository';

export class RequestsController {
  constructor(
    @repository(RequestsRepository)
    public requestsRepository: RequestsRepository,
    @repository(PetsRepository)
    public petsRepository: PetsRepository,
  ) {}

  @post('/requests')
  @response(200, {
    description: 'Requests model instance',
    content: {'application/json': {schema: getModelSchemaRef(Requests)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          // schema: getModelSchemaRef(RequestRevision, {
          //   title: 'NewRequests',
          //   exclude: ['id'],
          // }),
        },
      },
    })
    requests: Omit<RequestRevision, 'id'>,
  ): Promise<Requests> {
    const revisionData = {
      city: requests.city,
      address: requests.address,
      date: requests.date,
      state: 'pending',
      details: '',
      ownerId: requests.ownerId,
    };
    const revision = await this.requestsRepository.create(revisionData);

    const mascotaData = {
      id: revision.id,
      status: 'pendiente',
      name: requests.name,
      age: requests.age,
      breed: requests.breed,
      color: requests.color,
      photo: requests.photo,
      description: requests.description,
      ownerId: requests.ownerId,
    };
    await this.petsRepository.create(mascotaData);

    return revision;
  }

  @get('/requests/count')
  @response(200, {
    description: 'Requests model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Requests) where?: Where<Requests>): Promise<Count> {
    return this.requestsRepository.count(where);
  }

  @get('/requests')
  @response(200, {
    description: 'Array of Requests model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Requests, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Requests) filter?: Filter<Requests>): Promise<Requests[]> {
    return this.requestsRepository.find(filter);
  }

  @patch('/requests')
  @response(200, {
    description: 'Requests PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Requests, {partial: true}),
        },
      },
    })
    requests: Requests,
    @param.where(Requests) where?: Where<Requests>,
  ): Promise<Count> {
    return this.requestsRepository.updateAll(requests, where);
  }

  @get('/requests/{id}')
  @response(200, {
    description: 'Requests model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Requests, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Requests, {exclude: 'where'}) filter?: FilterExcludingWhere<Requests>,
  ): Promise<Requests> {
    return this.requestsRepository.findById(id, filter);
  }

  @patch('/requests/{id}')
  @response(204, {
    description: 'Requests PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Requests, {partial: true}),
        },
      },
    })
    requests: Requests,
  ): Promise<void> {
    await this.requestsRepository.updateById(id, requests);
  }

  @put('/requests/{id}')
  @response(204, {
    description: 'Requests PUT success',
  })
  async replaceById(@param.path.string('id') id: string, @requestBody() requests: Requests): Promise<void> {
    await this.requestsRepository.replaceById(id, requests);
  }

  @del('/requests/{id}')
  @response(204, {
    description: 'Requests DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.requestsRepository.deleteById(id);
  }
}
