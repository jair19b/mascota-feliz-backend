import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import bcrypt from 'bcrypt';
import sha256 from 'crypto-js/sha256';
import {Keys as llaves} from '../config/keys';
import {UserTokenData} from '../interfaces';
import {Users} from './../models/users.model';
import {UsersRepository} from './../repositories/users.repository';
import {NotificationsService} from './notifications.service';
import {ValidationsService} from './validations.service';
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  private jwtSignature: string = 'kyS6z&55%mqY!vftp97dc^A9i6FgPikPJ5AQ$UHU%4QPx$%QwjbH87^snfL7sqJd';
  private jwtSignatureVerify: string = '1bsDh0i!ek4bWl48nPBl!t#%Oy6u!Moz';

  constructor(
    @service(ValidationsService)
    public validationsService: ValidationsService,
    @service(NotificationsService)
    public notificationService: NotificationsService,
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
    if (data.userData.status != 'active' && data.userData.status != 'inactive')
      throw new HttpErrors[401]('Tu cuenta no está verificada por favor verificala antes de ingresar');
    const validate = await this._validatePassword(data.passwordPlaintText, data.userData.password);
    if (!validate) throw new HttpErrors[401]('Credenciales incorrectas, por favor verifiquelas e intente nuevamente');
    if (data.userData.status == 'inactive') throw new HttpErrors[403]('Debes actulizar tus credenciales');

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

    let contenido = `Hola <strong>Bienvenido a Mascota Feliz</strong><br>Tu codigo de verificacion de la cuenta es <big><strong>${activeToken.pin}</strong></big>`;
    this.notificationService.sendEmail(newUser.email, llaves.asuntoNewUser, contenido);

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

  /* Recupera una contraseña */
  async recuperarAccount(pin?: string, email?: string, password?: string) {
    if (!pin && email) {
      const user = await this.usersRepository.findOne({where: {email: email}});
      if (!user) throw new HttpErrors[400]('La cuenta no existe');
      const data = await this.setActivationKey();
      await this.usersRepository.updateById(user!.id, {activationKey: data.token});
      let contenido = `Codigo de recuperacion de tu cuenta es <strong>${data.pin}</strong>`;
      this.notificationService.sendEmail(email, 'Recuperacion de la cuenta', contenido);
      return true;
    } else if (pin && email && password) {
      const user = await this.usersRepository.findOne({where: {email: email}});
      if (!user || !user.activationKey) throw new HttpErrors[400]('La cuenta no se pude reestablecer');

      const code = await this.verifyToken(user.activationKey, this.jwtSignatureVerify);
      if (!code) throw new HttpErrors[500]('Se ha agotado el tiempo para verificar tu cuenta. Crea una nueva clave de activación');
      if (sha256(pin).toString() != code.data.pin) throw new HttpErrors[400]('Código de verificación inválido');
      const hash = await this.encryptPassword(password);
      await this.usersRepository.updateById(user.id, {status: 'active', activationKey: '', password: hash});
      return true;
    }
    throw new HttpErrors[400]('No podemos recuparar está cuenta. Envia los datos necesarios');
  }

  /** asignar un asesor */
  async addAdvisor(fields: Users): Promise<Users> {
    await this.validationsService.validAccountFields(fields);

    // generar contraseña aleatoria
    const pwa = this.randomNumbers(8);
    const passwordHash = await this.encryptPassword(pwa);
    console.log(pwa);

    const newUser = await this.usersRepository.create({
      ...fields,
      rol: 'advisor',
      password: passwordHash,
      status: 'inactive',
      activationKey: '',
    });
    newUser.password = '';
    newUser.activationKey = '';

    let contenido = `<h3 style="text-align: center;font-weight: bold;">Haz sido agregado como asesor en MascotaFeliz</h3>
    <p>Ahora eres parte de los <b>Asesores</b> de <b>Macota Feliz</b> te enviamos las credenciales de tu cuenta</p>
    <ul>
      <li><strong>Correo Electronico</strong>:&nbsp;<span>${newUser.email}</span></li>
      <li><strong>Contraseña de acceso temporal</strong>:&nbsp;<span>${pwa}</span></li>
    </ul>`;
    this.notificationService.sendEmail(newUser.email, llaves.asuntoNewUser, contenido);
    return newUser;
  }

  /** atualizar contraseña */
  async updatePassword(email: string, oldPassword: string, newPassword: string, login: boolean = false): Promise<any> {
    const user = await this.usersRepository.findOne({where: {email: email}});
    if (!user) throw new HttpErrors[400]('La cuenta no existe');

    const psv = await this._validatePassword(oldPassword, user.password);
    if (!psv) throw new HttpErrors[400]('La contraseña actual no es correcta');

    const hash = await this.encryptPassword(newPassword);
    this.usersRepository.updateById(user.id, {password: hash, status: 'active'});

    if (login) {
      let payload: UserTokenData = {
        name: user.name,
        lastName: user.lastName,
        rol: user.rol!,
        uid: user.id!,
      };
      const token = await this.generateToken(payload, 3600 * 24, this.jwtSignature);
      return {...payload, token};
    }

    return true;
  }
}
