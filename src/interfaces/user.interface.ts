import {Users} from '../models';

export interface UserTokenData {
  name: string;
  lastName: string;
  rol: string;
  uid: string;
}

export interface UserAccountValidate {
  userData: Users;
  passwordPlaintText: string;
}

export interface UserCredential {
  email: string;
  password: string;
}
