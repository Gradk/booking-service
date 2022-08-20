import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { MailModule } from '../../../../mail/src/app/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), MailModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminModule],
})
export class AdminModule {}
