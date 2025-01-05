import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateProductoDto {
    @IsString()
    nombre:string
    @IsNumber()
    precio:number
    @IsNumber()
    cantidadStock:number
    @IsString()
    estado:string
    @IsString()
    @IsOptional()
    categoria: string;
}
