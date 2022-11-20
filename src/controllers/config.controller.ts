import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {Configs} from '../models';
import {ConfigsRepository} from '../repositories';

export class ConfigController {
  constructor(
    @repository(ConfigsRepository)
    public configsRepository: ConfigsRepository,
  ) {}

  @authenticate('Admin')
  @post('/system')
  @response(200, {
    description: 'Configs model instance',
    content: {'application/json': {schema: getModelSchemaRef(Configs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configs, {
            title: 'NewConfigs',
            exclude: ['id'],
          }),
        },
      },
    })
    configs: Omit<Configs, 'id'>,
  ): Promise<Configs> {
    return this.configsRepository.create(configs);
  }

  @authenticate('Admin')
  @get('/system/count')
  @response(200, {
    description: 'Configs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Configs) where?: Where<Configs>): Promise<Count> {
    return this.configsRepository.count(where);
  }

  @authenticate('Admin')
  @get('/system')
  @response(200, {
    description: 'Array of Configs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Configs, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Configs) filter?: Filter<Configs>): Promise<Configs[]> {
    return this.configsRepository.find(filter);
  }

  @authenticate('Admin')
  @patch('/system')
  @response(200, {
    description: 'Configs PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configs, {partial: true}),
        },
      },
    })
    configs: Configs,
    @param.where(Configs) where?: Where<Configs>,
  ): Promise<Count> {
    return this.configsRepository.updateAll(configs, where);
  }

  @authenticate('Admin')
  @get('/system/{id}')
  @response(200, {
    description: 'Configs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Configs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Configs, {exclude: 'where'}) filter?: FilterExcludingWhere<Configs>,
  ): Promise<Configs> {
    return this.configsRepository.findById(id, filter);
  }

  @authenticate('Admin')
  @patch('/system/{id}')
  @response(204, {
    description: 'Configs PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configs, {partial: true}),
        },
      },
    })
    configs: Configs,
  ): Promise<void> {
    await this.configsRepository.updateById(id, configs);
  }

  @authenticate('Admin')
  @put('/system/{id}')
  @response(204, {
    description: 'Configs PUT success',
  })
  async replaceById(@param.path.string('id') id: string, @requestBody() configs: Configs): Promise<void> {
    await this.configsRepository.replaceById(id, configs);
  }

  @authenticate('Admin')
  @del('/system/{id}')
  @response(204, {
    description: 'Configs DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.configsRepository.deleteById(id);
  }
}
