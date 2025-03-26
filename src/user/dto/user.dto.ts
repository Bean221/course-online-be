import { users } from '@prisma/client';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @Matches(/^[0-9]{10}$/)
  @MinLength(10)
  phone: string;
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
