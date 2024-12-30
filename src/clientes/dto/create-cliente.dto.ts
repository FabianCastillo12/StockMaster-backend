import { IsEmail, IsString, IsOptional } from "class-validator";

export class CreateClienteDto {
    @IsString()
    nombre:string;
    @IsEmail()
    email:string;
    @IsString()
    telefono:string;
    @IsString()
    direccion:string;
    @IsString()
    dni:string;
    @IsString()
    ruc:string;
}
