import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ReportsService } from './reportes-doc.service';
import { ReportsController } from './reportes-doc.controller';
import { Producto } from '../producto/entities/producto.entity'; 
import { Cliente } from '../clientes/entities/cliente.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto,Cliente,Pedido]), 
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportesDocModule {}
