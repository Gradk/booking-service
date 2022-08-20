import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { sign } from 'jsonwebtoken';
import { AdminAndToken } from '@book/interfaces';
import { setPassword } from '@book/functions';
import { randomBytes } from 'crypto';
import { PasswordAndToken } from '@book/interfaces';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>
  ) {}

  async createAdmin(dto: CreateAdminDto): Promise<AdminAndToken> {
    const admin = await this.adminRepository.findOneBy({
      email: dto.email,
    });

    if (admin) {
      throw new HttpException('Admin Duplicate Error', 401);
    } else {
      const newAdmin = {
        ...dto,
        password: await setPassword(dto.password),
      };

      const result = await this.adminRepository.save(newAdmin);

      const token = sign(dto.email, process.env.JWT_SECRET);

      delete result.password;

      return { admin: { ...result, token } };
    }
  }

  async findAll(): Promise<AdminEntity[]> {
    return await this.adminRepository.find();
  }

  async findOneByEmail(email: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ email });
    if (admin) {
      return await this.adminRepository.findOneBy({ email });
    } else {
      throw new HttpException('admin not found', 404);
    }
  }

  async findOneById(id_admin: number): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ id_admin });

    if (admin) {
      return await this.adminRepository.findOneBy({ id_admin });
    } else {
      throw new HttpException('admin not found', 404);
    }
  }

  async update(id_admin: number, dto: CreateAdminDto): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ id_admin });

    if (admin) {
      await this.adminRepository.update(
        { id_admin },
        { ...dto, password: await setPassword(dto.password) }
      );
      return await this.adminRepository.findOneBy({ id_admin });
    } else {
      throw new HttpException('admin not found', 404);
    }
  }

  async remove(id_admin: number): Promise<number> {
    const admin = await this.adminRepository.findOneBy({ id_admin });

    if (!admin) {
      throw new HttpException('user not found', 404);
    } else {
      await this.adminRepository.delete({ id_admin });
      return id_admin;
    }
  }

  async forgotPassword(email: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ email });

    if (admin) {
      const token = randomBytes(32).toString('hex');

      // One day for expiration of reset token
      const expiration = new Date(Date().valueOf() + 24 * 60 * 60 * 1000);

      await this.adminRepository.update(
        { id_admin: admin.id_admin },
        { passwordReset: { token: token, expiration: expiration } }
      );

      const newAdmin = await this.adminRepository.findOneBy({ email });

      return newAdmin;
    } else {
      throw new HttpException('admin not found', 404);
    }
  }

  async setPassword(dto: PasswordAndToken): Promise<string> {
    //находим по токену юзера
    const adminToken = await this.adminRepository
      .createQueryBuilder('admin')
      .where(`admin.passwordReset ->>'token' = :token`, {
        token: `${dto.token}`,
      })
      .getOne();

    //находим время жизни токена
    const expirationToken = await adminToken.passwordReset.expiration;

    //если токен существует и дата его не истекла, то меняем пароль
    if (adminToken && new Date(expirationToken) < new Date()) {
      await this.adminRepository.update(
        { id_admin: adminToken.id_admin },
        { password: await setPassword(dto.password) }
      );
      return 'Пароль успешно обновлен';
    } else {
      throw new HttpException('Токен неверный', 202);
    }
  }
}
