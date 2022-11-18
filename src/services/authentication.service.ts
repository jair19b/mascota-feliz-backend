import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {UserTokenData} from '../interfaces';
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  constructor(/* Add @inject to inject parameters */) {}

  /** Creacion de unn token */
  public async generateToken(payload: UserTokenData, expiration: number, signature: any): Promise<string> {
    const time = Date.now(),
      exp = Math.floor(Date.now() / 1000) + expiration;

    return await jwt.sing({iat: time, exp, data: payload}, signature);
  }

  /** Valida un token */
  public async validateToken(token: string, signature: any): Promise<UserTokenData> {
    try {
      const data = await jwt.verify(token, signature);
      if (!data) throw new HttpErrors[401]('No estás autorizado para realizar esta acción');

      return data.data;
    } catch (error) {
      throw new HttpErrors[401]('No estás autorizado para realizar esta acción');
    }
  }
}
