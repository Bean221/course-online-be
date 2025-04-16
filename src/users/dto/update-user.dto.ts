import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { role_enum } from '@prisma/client';

export enum RoleEnum {
  STUDENT = 'student',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  update_at?: string;

  @IsOptional()
  @IsEnum(role_enum, { message: 'role phải là student, manager hoặc admin' })
  role?: role_enum;

  @IsOptional()
  @IsEnum(Gender, { message: 'giới tính phải là MALE hoặc FEMALE hoặc OTHER' })
  gender?: Gender;

  @IsDateString()
  birth_date: string;

  @IsOptional()
  @IsString()
  address: string;
}
