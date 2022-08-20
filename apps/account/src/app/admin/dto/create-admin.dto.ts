import { IsString, IsEmail, Min } from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @Min(2)
  name: string;

  @IsString()
  password: string;
}
