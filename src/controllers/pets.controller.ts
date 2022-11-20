import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Pets} from '../models';
import {PetsRepository} from '../repositories';

export class PetsController {
  constructor(
    @repository(PetsRepository)
    public petsRepository : PetsRepository,
  ) {}

  @post('/pets')
  @response(200, {
    description: 'Pets model instance',
    content: {'application/json': {schema: getModelSchemaRef(Pets)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pets, {
            title: 'NewPets',
            
          }),
        },
      },
    })
    pets: Pets,
  ): Promise<Pets> {
    return this.petsRepository.create(pets);
  }

  @get('/pets/count')
  @response(200, {
    description: 'Pets model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Pets) where?: Where<Pets>,
  ): Promise<Count> {
    return this.petsRepository.count(where);
  }

  @get('/pets')
  @response(200, {
    description: 'Array of Pets model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pets, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Pets) filter?: Filter<Pets>,
  ): Promise<Pets[]> {
    return this.petsRepository.find(filter);
  }

  @patch('/pets')
  @response(200, {
    description: 'Pets PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pets, {partial: true}),
        },
      },
    })
    pets: Pets,
    @param.where(Pets) where?: Where<Pets>,
  ): Promise<Count> {
    return this.petsRepository.updateAll(pets, where);
  }

  @get('/pets/{id}')
  @response(200, {
    description: 'Pets model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pets, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Pets, {exclude: 'where'}) filter?: FilterExcludingWhere<Pets>
  ): Promise<Pets> {
    return this.petsRepository.findById(id, filter);
  }

  @patch('/pets/{id}')
  @response(204, {
    description: 'Pets PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pets, {partial: true}),
        },
      },
    })
    pets: Pets,
  ): Promise<void> {
    await this.petsRepository.updateById(id, pets);
  }

  @put('/pets/{id}')
  @response(204, {
    description: 'Pets PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() pets: Pets,
  ): Promise<void> {
    await this.petsRepository.replaceById(id, pets);
  }

  @del('/pets/{id}')
  @response(204, {
    description: 'Pets DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.petsRepository.deleteById(id);
  }
}
