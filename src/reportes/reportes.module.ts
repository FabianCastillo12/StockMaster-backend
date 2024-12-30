import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { DetallePedido } from '../detalle-pedidos/entities/detalle-pedido.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, DetallePedido]), 
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}