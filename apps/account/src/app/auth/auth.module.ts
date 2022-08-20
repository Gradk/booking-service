import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '../admin/admin.module';
import { AdminEntity } from '../admin/entities/admin.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [AdminModule, TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
