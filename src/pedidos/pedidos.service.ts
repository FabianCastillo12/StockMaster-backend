import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePedidoDto } from "./dto/create-pedido.dto";
import { UpdatePedidoDto } from "./dto/update-pedido.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Pedido } from "./entities/pedido.entity";
import { Repository } from "typeorm";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { DetallePedido } from "src/detalle-pedidos/entities/detalle-pedido.entity";
import { Producto } from "src/producto/entities/producto.entity";
import { DetallePedidosService } from "src/detalle-pedidos/detalle-pedidos.service";
import { Not, In } from "typeorm";

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepository: Repository<Pedido>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(DetallePedido)
    private readonly detalleRepository: Repository<DetallePedido>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly detallePedidosService: DetallePedidosService
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const cliente = await this.clienteRepository.findOne({
      where: { id: createPedidoDto.clienteId },
    });
    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${createPedidoDto.clienteId} no encontrado.`
      );
    }

    // El ID del pedido se obtendrá después de guardar el pedido
    const detallesPromises = createPedidoDto.detalles.map(
      async (detalleDto) => {
        const producto = await this.productoRepository.findOneBy({
          id: detalleDto.productoId,
        });
        if (!producto) {
          throw new NotFoundException(
            `Producto con ID ${detalleDto.productoId} no encontrado.`
          );
        }

        const precio_unitario = producto.precio;
        const subTotal = detalleDto.cantidad * precio_unitario;

        // Crear el detalle del pedido con el ID del pedido
        const detalle = this.detalleRepository.create({
          cantidad: detalleDto.cantidad,
          precio_unitario: precio_unitario,
          subTotal: subTotal,
          producto: producto,
          // Asignar el pedido más adelante después de que se haya creado
        });

        return detalle; // Guardar el detalle del pedido después
      }
    );

    const pedido = this.pedidosRepository.create({
      fecha_pedido: new Date(),
      actualizar_pedido: new Date(),
      estado: createPedidoDto.estado,
      total: 0, // Se actualizará más tarde
      cliente: cliente,
      detallePedidos: [], // Inicialmente vacío
    });

    // Guardar el pedido para obtener el ID
    const savedPedido = await this.pedidosRepository.save(pedido);
    console.log(savedPedido.id);

    // Actualizar detalles con el ID del pedido
    const savedDetallesPromises = createPedidoDto.detalles.map(
      async (detalleDto) => {
        const producto = await this.productoRepository.findOneBy({
          id: detalleDto.productoId,
        });
        if (!producto) {
          throw new NotFoundException(
            `Producto con ID ${detalleDto.productoId} no encontrado.`
          );
        }

        const precio_unitario = producto.precio;
        const subTotal = detalleDto.cantidad * precio_unitario;
        console.log(savedPedido, "pedido");
        const detalle = this.detalleRepository.create({
          cantidad: detalleDto.cantidad,
          precio_unitario: precio_unitario,
          subTotal: subTotal,
          producto: producto,
          pedido: savedPedido, // Asignar el pedido guardado
        });
        console.log(savedPedido, "pedido 2");
        return this.detalleRepository.save(detalle);
      }
    );

    const savedDetalles = await Promise.all(savedDetallesPromises);

    // Actualizar el pedido con los detalles guardados y el total
    savedPedido.total = savedDetalles.reduce(
      (total, detalle) => total + detalle.subTotal,
      0
    );
    savedPedido.detallePedidos = savedDetalles;
    console.log(savedPedido, "pedido 3");
    return await this.pedidosRepository.save(savedPedido);
  }

  findAll() {
    return this.pedidosRepository.find({
      relations: ["cliente", "detallePedidos", "detallePedidos.producto"],
    });
  }

  async findOne(id: number) {
    const pedido = await this.pedidosRepository.findOne({
      where: { id: id },
      relations: ["cliente", "detallePedidos", "detallePedidos.producto"],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado.`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.pedidosRepository.findOne({
      where: { id: id },
      relations: ["detallePedidos"],
    });
  
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado.`);
    }
  
    // Actualizar cliente
    if (updatePedidoDto.clienteId) {
      const cliente = await this.clienteRepository.findOne({
        where: { id: updatePedidoDto.clienteId },
      });
      if (!cliente) {
        throw new NotFoundException(
          `Cliente con ID ${updatePedidoDto.clienteId} no encontrado.`
        );
      }
      pedido.cliente = cliente;
    }
  
    // Actualizar estado
    if (updatePedidoDto.estado) {
      pedido.estado = updatePedidoDto.estado;
    }
  
    // Actualizar detalles
    if (updatePedidoDto.detalles) {
      // Eliminar detalles no presentes en el DTO
      const detalleIds = updatePedidoDto.detalles.map((detalle) => detalle.id);
      await this.detalleRepository.delete({
        pedido: { id: id },
        id: Not(In(detalleIds)),
      });
  
      // Actualizar o crear nuevos detalles
      const detallesPromises = updatePedidoDto.detalles.map(async (detalleDto) => {
        console.log('Detalle DTO:', detalleDto);
  
        if (detalleDto.id) {
          // Actualizar detalle existente
          const detalle = await this.detalleRepository.findOneBy({ id: detalleDto.id });
          if (!detalle) {
            throw new NotFoundException(`Detalle con ID ${detalleDto.id} no encontrado.`);
          }
  
          if (detalleDto.cantidad === undefined) {
            throw new Error('Cantidad no proporcionada.');
          }
  
          // Obtener el producto usando productoId de detalleDto
          const producto = await this.productoRepository.findOneBy({ id: detalleDto.productoId });
          if (!producto) {
            throw new NotFoundException(`Producto con ID ${detalleDto.productoId} no encontrado.`);
          }
  
          const precio_unitario = producto.precio;
          detalle.cantidad = detalleDto.cantidad;
          detalle.precio_unitario = Number(precio_unitario);
          detalle.subTotal = detalleDto.cantidad * precio_unitario;
  
          detalle.pedido = pedido;
          console.log('Subtotal:', detalle.subTotal);
  
          return this.detalleRepository.save(detalle);
        } else {
          // Crear nuevo detalle
          const producto = await this.productoRepository.findOneBy({
            id: detalleDto.productoId,
          });
          if (!producto) {
            throw new NotFoundException(
              `Producto con ID ${detalleDto.productoId} no encontrado.`
            );
          }
  
          const detalle = this.detalleRepository.create({
            cantidad: detalleDto.cantidad,
            precio_unitario: producto.precio,
            subTotal: detalleDto.cantidad * producto.precio,
            producto: producto,
            pedido: pedido,
          });
          return this.detalleRepository.save(detalle);
        }
      });
  
      const savedDetalles = await Promise.all(detallesPromises);
      pedido.detallePedidos = savedDetalles;
    }
  
    // Actualizar el total del pedido
    pedido.total = pedido.detallePedidos.reduce(
      (total, detalle) => total + detalle.subTotal,
      0
    );
  
    // Guardar el pedido actualizado
    const updatedPedido = await this.pedidosRepository.save(pedido);
  
    // Crear una versión simplificada del pedido para evitar referencias circulares
    const simplifiedPedido = {
      ...updatedPedido,
      detallePedidos: updatedPedido.detallePedidos.map((detalle) => ({
        ...detalle,
        pedido: undefined, // Eliminar referencia circular
      })),
      cliente: {
        ...updatedPedido.cliente,
      },
    };
  
    return simplifiedPedido;
  }

  async remove(id: number) {
    const pedido = await this.pedidosRepository.findOne({
      where: { id: id },
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado.`);
    }

    await this.pedidosRepository.remove(pedido);

    return {
      message: `Pedido con ID ${id} y sus detalles han sido eliminados.`,
      pedidoEliminado: id,
    };
  }
}
