import {HttpErrors} from '@loopback/rest';

const jwt = require('jsonwebtoken');

interface UserData {
  name: string;
  lastName: string;
  uid: string;
  rol: string;
}

export class AuthService {
  constructor() {}

  /** Creacion de unn token */
  public async generateToken(payload: UserData, expiration: number, signature: any): Promise<string> {
    const time = Date.now(),
      exp = Math.floor(Date.now() / 1000) + expiration;

    return await jwt.sing({iat: time, exp, data: payload}, signature);
  }

  /** Valida un token */
  public async validateToken(token: string, signature: any): Promise<UserData> {
    try {
      const data = await jwt.verify(token, signature);
      if (!data) throw new HttpErrors[401]('No estás autorizado para realizar esta acción');

      return data.data;
    } catch (error) {
      throw new HttpErrors[401]('No estás autorizado para realizar esta acción');
    }
  }

  /** Validar */
}
