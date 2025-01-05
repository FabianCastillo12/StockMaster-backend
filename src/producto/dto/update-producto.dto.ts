import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductoDto {
    @IsOptional()
    @IsString()
    nombre?:string;

    @IsOptional()
    @IsNumber()
    precio?:number;

    @Min(0)
    @IsOptional()
    @IsNumber()
    cantidadStock?: number;
    
    @IsOptional()
    @IsString()
    estado?: string;


}

