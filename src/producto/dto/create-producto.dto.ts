import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateProductoDto {
    @IsString()
    nombre:string
    @IsNumber()
    precio:number
    @IsNumber()
    cantidadStock:number
    @IsString()
    unidad_medida:string
    @IsString()
    estado:string
    @IsString()
    @IsOptional()
    categoria: string;
}
