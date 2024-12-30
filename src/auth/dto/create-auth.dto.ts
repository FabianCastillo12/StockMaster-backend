import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  nombre: string;
  @IsEmail()
  email: string;
  @Transform(({value})=>value.trim())
  @IsString()
  @MinLength(6)
  password: string;
  @Transform(({value})=>value.trim())
  @IsString()
  @MinLength(6)
  confir_password: string;
  @IsOptional()
  role:string
}
