import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ROLES } from '../enum/role.auth';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    @IsOptional()
    @IsString()
    nombre?: string;
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    @Transform(({value})=>value.trim())
    @IsString()
    @MinLength(6)
    password?: string;
    @IsOptional()
    role?: string;

}
