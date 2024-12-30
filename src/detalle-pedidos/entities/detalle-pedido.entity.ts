import { Pedido } from "src/pedidos/entities/pedido.entity";
import { Producto } from "src/producto/entities/producto.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";

@Entity()
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  @Column({ type: "float" })
  precio_unitario: number;

  @Column({ type: "float" })
  subTotal: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.detallePedidos, { onDelete: 'CASCADE' })
  pedido: Pedido;

  @ManyToOne(() => Producto, (producto) => producto.detallePedidos)
  producto: Producto;
}