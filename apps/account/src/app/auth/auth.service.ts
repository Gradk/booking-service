import { AdminAndToken } from '@book/interfaces';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AdminEntity } from '../admin/entities/admin.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>
  ) {}

  async loginAdmin(dto: LoginDto): Promise<AdminAndToken> {
    const admin = await this.adminRepository.findOneBy({
      email: dto.email,
    });

    if (!admin) {
      throw new HttpException('admin not found', 422);
    }

    const isCorrectPassword = await compare(dto.password, admin.password);

    if (!isCorrectPassword) {
      throw new HttpException('admin password no correct', 422);
    }

    const token = sign(dto.email, process.env.JWT_SECRET);

    delete admin.password;

    return { admin: { ...admin, token } };
  }
}
