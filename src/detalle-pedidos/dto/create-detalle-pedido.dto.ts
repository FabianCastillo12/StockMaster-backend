import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsInt()
  @IsNotEmpty()
  readonly cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  readonly precio_unitario: number;

  @IsNumber()
  @IsNotEmpty()
  readonly subTotal: number;

  @IsInt()
  @IsNotEmpty()
  readonly productoId: number; // ID del producto

  @IsInt()
  @IsNotEmpty()
  readonly pedidoId: number;   // ID del pedido al que pertenece
}
