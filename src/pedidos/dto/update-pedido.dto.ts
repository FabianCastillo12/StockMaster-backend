import { IsInt, IsOptional, IsString, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDetallePedidoDto } from '../../detalle-pedidos/dto/update-detalle-pedido.dto';

export class UpdatePedidoDto {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  total?: number;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateDetallePedidoDto)
  detalles?: UpdateDetallePedidoDto[];
}
