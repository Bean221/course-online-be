import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { role_enum } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  full_name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEnum(role_enum, { message: 'Vai trò không hợp lệ' })
  role?: role_enum;
}
