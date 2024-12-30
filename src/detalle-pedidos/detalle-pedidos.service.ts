import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { ProductoService } from 'src/producto/producto.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';

@Injectable()
export class DetallePedidosService {
  constructor(
    @InjectRepository(DetallePedido)
    private readonly detalleRepository: Repository<DetallePedido>,
    private readonly productoService: ProductoService, 
  ) {}

  async create(createDetalleDto: CreateDetallePedidoDto): Promise<DetallePedido> {
    // Verifica que el producto exista
    const producto = await this.productoService.findOne(createDetalleDto.productoId);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${createDetalleDto.productoId} no encontrado.`);
    }

    // Calcula el subtotal
    const subTotal = producto.precio * createDetalleDto.cantidad;
    console.log(createDetalleDto.pedidoId);
    
    // Crea el detalle de pedido con el ID del pedido
    const detalle = this.detalleRepository.create({
      pedido: { id: createDetalleDto.pedidoId },
      cantidad: createDetalleDto.cantidad,
      precio_unitario: producto.precio,
      subTotal: subTotal,
      producto: producto,
    });
    return this.detalleRepository.save(detalle);
  }

  findAll() {
    return this.detalleRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} detallePedido`;
  }

  update(id: number, updateDetallePedidoDto: UpdateDetallePedidoDto) {
    return `This action updates a #${id} detallePedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallePedido`;
  }
}
