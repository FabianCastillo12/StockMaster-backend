import { IsNotEmpty, IsArray, IsString, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleDto {
  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  productoId: number;
}

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsNotEmpty()
  @IsString()
  clienteId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleDto)
  detalles: DetalleDto[];
}
