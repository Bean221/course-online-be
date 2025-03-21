import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  full_name: string;

  @Matches(/^[0-9]{10}$/)
  phone: string;

  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}
export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
