import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { DetallePedido } from 'src/detalle-pedidos/entities/detalle-pedido.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { ProductoModule } from 'src/producto/producto.module';
import { DetallePedidosModule } from 'src/detalle-pedidos/detalle-pedidos.module';
import { ClientesModule } from 'src/clientes/clientes.module';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Pedido,DetallePedido,Producto,Cliente]),ProductoModule,DetallePedidosModule,ClientesModule],
  exports:[PedidosModule],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
