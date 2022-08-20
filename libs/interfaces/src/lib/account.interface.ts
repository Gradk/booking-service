import { AdminEntity } from '../../../../apps/account/src/app/admin/entities/admin.entity';

export interface IAbstractUser {
  name: string;
  email: string;
  password: string;
  confirmEmail: boolean;
}

export interface AdminAndToken {
  admin: AdminEntity & { token: string };
}

export interface PasswordAndToken {
  token: string;
  password: string;
}
