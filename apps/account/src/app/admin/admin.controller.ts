import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { MailService } from '../../../../mail/src/app/mail.service';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PasswordAndToken } from '@book/interfaces';

@Controller('admin')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly mailService: MailService
  ) {}

  @Post('/register')
  async createAdmin(@Body() dto: CreateAdminDto) {
    const admin = await this.adminService.createAdmin(dto);
    return admin;
  }

  @Get('/all')
  async findAll() {
    const admins = await this.adminService.findAll();
    return admins;
  }

  @Post('/find')
  async findOneByEmail(@Body('email') email: string) {
    console.log(email);
    const admin = await this.adminService.findOneByEmail(email);
    return admin;
  }

  @Patch(':id')
  async update(@Param('id') id_admin: number, @Body() dto: CreateAdminDto) {
    const admin = await this.adminService.update(id_admin, dto);
    return admin;
  }

  @Delete(':id')
  async remove(@Param('id') id_admin: number) {
    const admin = await this.adminService.remove(id_admin);
    return admin;
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body('email') email: string) {
    const admin = await this.adminService.forgotPassword(email);
    const sendMail = await this.mailService.forgotPassword(admin);
    return sendMail;
  }

  @Post('/setPassword')
  async setPassword(@Body() dto: PasswordAndToken) {
    const admin = await this.adminService.setPassword(dto);
    return admin;
  }

  //дописать подтверждение почты
}
