import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import moment from 'moment';
import {UserAccountValidate} from '../interfaces';
import {Users} from './../models/users.model';
import {LocationsRepository} from './../repositories/locations.repository';
import {UsersRepository} from './../repositories/users.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class ValidationsService {
  constructor(
    @repository(UsersRepository) public usersRepository: UsersRepository,
    @repository(LocationsRepository) public locationsRepository: LocationsRepository,
  ) {}

  /** Validate an user login */
  async validateUserLogin(email: string, password: string): Promise<UserAccountValidate> {
    // validate the correct format
    if (!this.validateEmail(email)) throw new HttpErrors[400]('El correo electrónico no es válido');
    if (!password) throw new HttpErrors[400]('La contraseña es requerida');

    // check existing of user
    const user = await this.usersRepository.findOne({where: {email: email}});
    if (!user) throw new HttpErrors[400]('Error en las credenciales, por favor verifica e intenta nuevamente');

    return {userData: user, passwordPlaintText: password};
  }

  /** Validate existing of user */
  async isExitsAccount(email?: string, cedula?: string, id?: string): Promise<boolean> {
    const filter: any = {};
    if (email) {
      filter.where = {email};
    } else if (email && cedula) {
      filter.where = {or: [{email}, {cedula}]};
    } else if (cedula) {
      filter.where = {cedula};
    } else if (id) {
      filter.where = {id};
    } else {
      return false;
    }

    const user = await this.usersRepository.findOne(filter);
    return !user ? false : true;
  }

  /** Validate fileds before create an user account */
  async validAccountFields(fields: Users): Promise<void> {
    // get config time
    const yearTime = moment(fields.birthday).year();
    const currentYear = moment().year();

    // validate corrcet format of fileds
    if (!this.validateCedula(fields.cedula)) throw new HttpErrors[400]('Formato de cedula inválido');
    if (!this.validateNames(fields.name)) throw new HttpErrors[400]('El nombre ingresado no es válido');
    if (!this.validateNames(fields.lastName)) throw new HttpErrors[400]('El apellido ingresado no es válido');
    if (!this.validateGender(fields.gender)) throw new HttpErrors[400]('El género imgresado no es válido');
    if (!this.validateCellphone(fields.cellphone)) throw new HttpErrors[400]('El núemro de teléfono es inválido');
    if (!this.validateNames(fields.city)) throw new HttpErrors[400]('Nombre de la ciudad no válido');
    if (!this.validateAddress(fields.address))
      throw new HttpErrors[400]('La dirección ingresada no cumple con las carcteristicas de una dirección');
    if (!this.validateEmail(fields.email)) throw new HttpErrors[400]('Correo electrónico inválido');
    if (fields.password.length < 6) throw new HttpErrors[400]('La contraseña debe tener mínimo 8 carácteres');
    if (!moment(fields.birthday).isValid() || currentYear - yearTime < 18)
      throw new HttpErrors[400]('Debes ser mayor de edad para crear una cuenta');

    // verify is user already exists
    const user = await this.usersRepository.findOne({where: {or: [{email: fields.email}, {cedula: fields.cedula}]}});
    if (user) throw new HttpErrors[400]('Esta cuenta ya existe');

    // Validate if locations exist
    const location = await this.locationsRepository.findOne({where: {id: fields.locationId}});
    if (!location) throw new HttpErrors[400]('La sede a la que pertenece este usuario no existe');
  }

  /** Validate email */
  validateEmail(email: string): boolean | void {
    return !email || !email.match(/^[a-z0-9_-]+(?:\.[a-z0-9_-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/gi)
      ? false
      : true;
  }

  /** Validate an name or last name */
  validateNames(name: string): boolean {
    return !name.match(/^[a-záéíóú]+(\s[a-záéíóú]+)*$/gi) ? false : true;
  }

  /** validate cedula */
  validateCedula(cedula: string): boolean {
    return !cedula.match(/^[0-9]{7,15}$/gi) ? false : true;
  }

  /** validate gender */
  validateGender(gender: string): boolean {
    return gender != 'M' && gender != 'F' && gender != 'O' ? false : true;
  }

  /** validate cellphone */
  validateCellphone(cellphone: string): boolean {
    return !cellphone.match(/^[0-9]{10,15}$/gi) ? false : true;
  }

  /** validate cellphone */
  validateAddress(address: string): boolean {
    return !address.match(/^[a-z]+(\s[a-z0-9#\-])*/gi) ? false : true;
  }
}
