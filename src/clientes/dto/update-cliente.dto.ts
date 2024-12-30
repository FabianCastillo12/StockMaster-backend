import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { IsEmail, IsString, IsOptional } from "class-validator";

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
    @IsString()
    @IsOptional()
    nombre:string;
    @IsEmail()
    @IsOptional()
    email:string;
    @IsString()
    @IsOptional()
    telefono:string;
    @IsString()
    @IsOptional()
    direccion:string;
    @IsString()
    @IsOptional()
    dni:string;
    @IsString()
    @IsOptional()
    ruc:string;
}
