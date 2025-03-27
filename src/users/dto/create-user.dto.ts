import { users } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export interface UserFilterType {
  item_per_page?: number;
  page?: number;
  search?: string;
}
export interface UserPaginationResponseType {
  data: users[];
  total: number;
  currentPage: number;
  itemPerPage: number;
}
