import { IsInt, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateDetallePedidoDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  precio_unitario?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  subTotal?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  productoId?: number;
}
