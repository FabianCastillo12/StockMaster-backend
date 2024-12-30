import { Module } from '@nestjs/common';
import { DetallePedidosService } from './detalle-pedidos.service';
import { DetallePedidosController } from './detalle-pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { ProductoModule } from 'src/producto/producto.module';

@Module({
  imports:[TypeOrmModule.forFeature([DetallePedido]),
  ProductoModule],
  providers: [DetallePedidosService],
  controllers: [DetallePedidosController],
  exports: [DetallePedidosService]
})
export class DetallePedidosModule {}
