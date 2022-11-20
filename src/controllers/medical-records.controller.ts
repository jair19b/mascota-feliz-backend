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
import {MedicalRecords} from '../models';
import {MedicalRecordsRepository} from '../repositories';

export class MedicalRecordsController {
  constructor(
    @repository(MedicalRecordsRepository)
    public medicalRecordsRepository : MedicalRecordsRepository,
  ) {}

  @post('/medical-records')
  @response(200, {
    description: 'MedicalRecords model instance',
    content: {'application/json': {schema: getModelSchemaRef(MedicalRecords)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedicalRecords, {
            title: 'NewMedicalRecords',
            
          }),
        },
      },
    })
    medicalRecords: MedicalRecords,
  ): Promise<MedicalRecords> {
    return this.medicalRecordsRepository.create(medicalRecords);
  }

  @get('/medical-records/count')
  @response(200, {
    description: 'MedicalRecords model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MedicalRecords) where?: Where<MedicalRecords>,
  ): Promise<Count> {
    return this.medicalRecordsRepository.count(where);
  }

  @get('/medical-records')
  @response(200, {
    description: 'Array of MedicalRecords model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MedicalRecords, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MedicalRecords) filter?: Filter<MedicalRecords>,
  ): Promise<MedicalRecords[]> {
    return this.medicalRecordsRepository.find(filter);
  }

  @patch('/medical-records')
  @response(200, {
    description: 'MedicalRecords PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedicalRecords, {partial: true}),
        },
      },
    })
    medicalRecords: MedicalRecords,
    @param.where(MedicalRecords) where?: Where<MedicalRecords>,
  ): Promise<Count> {
    return this.medicalRecordsRepository.updateAll(medicalRecords, where);
  }

  @get('/medical-records/{id}')
  @response(200, {
    description: 'MedicalRecords model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MedicalRecords, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MedicalRecords, {exclude: 'where'}) filter?: FilterExcludingWhere<MedicalRecords>
  ): Promise<MedicalRecords> {
    return this.medicalRecordsRepository.findById(id, filter);
  }

  @patch('/medical-records/{id}')
  @response(204, {
    description: 'MedicalRecords PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedicalRecords, {partial: true}),
        },
      },
    })
    medicalRecords: MedicalRecords,
  ): Promise<void> {
    await this.medicalRecordsRepository.updateById(id, medicalRecords);
  }

  @put('/medical-records/{id}')
  @response(204, {
    description: 'MedicalRecords PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() medicalRecords: MedicalRecords,
  ): Promise<void> {
    await this.medicalRecordsRepository.replaceById(id, medicalRecords);
  }

  @del('/medical-records/{id}')
  @response(204, {
    description: 'MedicalRecords DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.medicalRecordsRepository.deleteById(id);
  }
}
