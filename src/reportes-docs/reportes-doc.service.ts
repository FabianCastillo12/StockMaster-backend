import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Producto } from "../producto/entities/producto.entity";
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Pedido) 
    private readonly pedidoRepository: Repository<Pedido>,
  ) { }

  async getInventoryData() {
    return this.productRepository.find({
      select: [
        "id",
        "nombre",
        "cantidadStock",
        "precio",
        "estado",
      ],
      relations: ["categoria"],
    });
  }

  async getClientesData() {
    return this.clienteRepository.find({
      select: ['id', 'nombre', 'email', 'telefono', 'direccion', 'dni', 'ruc'],
    });
  }

  async getPedidosRegistradosData() {
    return this.pedidoRepository.find({
      where: { estado: "Registrado" },
      select: ['id', 'fecha_pedido', 'estado', 'total'],
      relations: ['cliente', 'detallePedidos'], 
    });
  }

  async getAllPedidosData() {
    return this.pedidoRepository.find({
      select: ['id', 'fecha_pedido', 'estado', 'total'],
      relations: ['cliente', 'detallePedidos'], 
    });
  }
}
