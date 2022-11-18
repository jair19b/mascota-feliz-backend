import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AuthenticationService} from './../services/authentication.service';

export class AdvisorStrategy implements AuthenticationStrategy {
  name: string = 'Advisor';

  constructor(
    @service(AuthenticationService)
    private authService: AuthenticationService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (!token) throw new HttpErrors[401]('No estás autorizado para realizar esta acción');

    const data = await this.authService.validateToken(token, 'hsjhgYvsiufsb7s9w7r6gsUY8IHVYSFS');
    if (data.rol != 'advisor') {
      throw new HttpErrors[401]('No estás autorizado para realizar esta acción');
    }

    const value: UserProfile = Object.assign({data});
    return value;
  }
}
