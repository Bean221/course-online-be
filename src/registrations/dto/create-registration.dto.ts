import {
  IsDateString,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDateString()
  dob: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsPhoneNumber('VN')
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cccd: string;

  @IsString()
  @IsNotEmpty()
  residence: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  format: string;

  @IsString()
  @IsNotEmpty()
  examType: string;

  @IsDecimal()
  price: number;

  @IsDateString()
  selectedDate: Date;
}
