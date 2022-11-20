import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import bcrypt from 'bcrypt';
import sha256 from 'crypto-js/sha256';
import {UserTokenData} from '../interfaces';
import {Users} from './../models/users.model';
import {UsersRepository} from './../repositories/users.repository';
import {ValidationsService} from './validations.service';
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  private jwtSignature: string = 'kyS6z&55%mqY!vftp97dc^A9i6FgPikPJ5AQ$UHU%4QPx$%QwjbH87^snfL7sqJd';
  private jwtSignatureVerify: string = '1bsDh0i!ek4bWl48nPBl!t#%Oy6u!Moz';

  constructor(
    @service(ValidationsService)
    public validationsService: ValidationsService,
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) {}

  /** Creacion de unn token */
  public async generateToken(payload: any, expiration: number, signature: any): Promise<string> {
    const time = Date.now();
    const exp = Math.floor(Date.now() / 1000) + expiration;
    return await jwt.sign({iat: time, exp, data: payload}, signature);
  }

  /** validate a token */
  async verifyToken(token: string, signature: string): Promise<any> {
    try {
      return await jwt.verify(token, signature);
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  /** Validate a session token */
  public async validateToken(token: string, signature: string = this.jwtSignature): Promise<UserTokenData> {
    try {
      const data = await this.verifyToken(token, signature);
      if (!data) throw new HttpErrors[401]('No estás autorizado para realizar esta acción');
      return data.data;
    } catch (error) {
      throw new HttpErrors[401]('No estás autorizado para realizar esta acción');
    }
  }

  /** Generate a password hash */
  async encryptPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  /** Validate password */
  private async _validatePassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  /** Login */
  async loginUser(email: string, password: string): Promise<any> {
    const data = await this.validationsService.validateUserLogin(email, password);
    if (data.userData.status != 'active') throw new HttpErrors[401]('Tu cuenta no está verificada por favor verificala antes de ingresar');
    const validate = await this._validatePassword(data.passwordPlaintText, data.userData.password);
    if (!validate) throw new HttpErrors[401]('Credenciales incorrectas, por favor verifiquelas e intente nuevamente');

    let payload: UserTokenData = {
      name: data.userData.name,
      lastName: data.userData.lastName,
      rol: data.userData.rol!,
      uid: data.userData.id!,
    };
    const token = await this.generateToken(payload, 3600 * 24, this.jwtSignature);

    return {...payload, token};
  }

  /** Create an user account  */
  async createAccount(fields: Users): Promise<Users> {
    await this.validationsService.validAccountFields(fields);
    const passwordHash = await this.encryptPassword(fields.password);
    const activeToken = await this.setActivationKey();
    console.log(activeToken.pin);

    const newUser = await this.usersRepository.create({
      ...fields,
      rol: 'cliente',
      password: passwordHash,
      status: 'unverified',
      activationKey: activeToken.token,
    });
    newUser.password = '';
    newUser.activationKey = '';
    return newUser;
  }

  /** Create a token for activate an account */
  randomNumbers(length: number = 1): string {
    let result: string = '';
    for (let i = 0; i <= length; i++) {
      result += Math.floor(Math.random() * (0 - 9 + 1) + 9);
    }
    return result;
  }

  /** Create a token for activate an account */
  async setActivationKey() {
    const pin = this.randomNumbers(6);
    const hash = sha256(pin).toString();
    const token = await this.generateToken({pin: hash}, 3600, this.jwtSignatureVerify);
    return {token, pin};
  }

  /** Verifi an account unverified */
  async verifyAccount(email: string, codeVerify: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({where: {email}});
    if (!user) throw new HttpErrors[400]('La cuneta que intentas verificar no existe');
    if (user.status != 'unverified' || !user.activationKey) throw new HttpErrors[500]('Error interno. No podemos verificar tu cuenta');

    const code = await this.verifyToken(user.activationKey, this.jwtSignatureVerify);
    if (!code) throw new HttpErrors[500]('Se ha agotado el tiempo para verificar tu cuenta. Crea una nueva clave de activación');
    if (sha256(codeVerify).toString() != code.data.pin) throw new HttpErrors[400]('Código de verificación inválido');
    await this.usersRepository.updateById(user.id, {status: 'active', activationKey: ''});
    return true;
  }
}
