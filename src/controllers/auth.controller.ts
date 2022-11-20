import {service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {UserCredential} from '../interfaces';
import {Users} from '../models';
import {AuthenticationService} from './../services/authentication.service';

export class AuthController {
  constructor(
    @service(AuthenticationService)
    private authenticationService: AuthenticationService,
  ) {}

  /* login of an user */
  @post('/auth/login')
  @response(200, {
    description: 'Login for user',
    content: {'application/json': {schema: getModelSchemaRef(Users, {exclude: []})}},
  })
  async login(
    @requestBody({
      description: 'Dtata of necessary for a login',
      content: {'application/json': {schema: {properties: {email: {type: 'string'}, password: {type: 'string'}}}}},
    })
    request: UserCredential,
  ): Promise<any> {
    return this.authenticationService.loginUser(request.email, request.password);
  }

  /* register an user */
  @post('/auth/register')
  @response(200, {
    description: 'Data of user',
    content: {'application/json': {schema: getModelSchemaRef(Users, {exclude: ['password']})}},
  })
  async register(
    @requestBody({
      description: 'Field required for to create an user account',
      content: {'application/json': {schema: getModelSchemaRef(Users, {exclude: ['id', 'activationKey', 'status']})}},
    })
    request: Omit<Users, 'id'>,
  ): Promise<Users> {
    return await this.authenticationService.createAccount(request);
  }

  /* verify account */
  @post('/auth/veriy/account')
  @response(200, {
    description: 'Data of request',
    content: {'application/json': {schema: getModelSchemaRef(Users, {exclude: []})}},
  })
  async veryAccount(
    @requestBody({
      description: 'Fileds required for to verify an user account',
      content: {'application/json': {schema: {properties: {email: {type: 'string'}, pin: {type: 'string'}}}}},
    })
    request: {
      email: string;
      pin: string;
    },
  ): Promise<boolean> {
    return await this.authenticationService.verifyAccount(request.email, request.pin);
  }
}
