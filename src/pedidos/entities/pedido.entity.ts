import { Cliente } from "src/clientes/entities/cliente.entity";
import { DetallePedido } from "src/detalle-pedidos/entities/detalle-pedido.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha_pedido: Date;

  @UpdateDateColumn()
  actualizar_pedido: Date;

  @Column({ type: "varchar" })
  estado: string;

  @Column({ type: "float" })
  total: number;

  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, {
    cascade: true,
  })
  detallePedidos: DetallePedido[];

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
  cliente: Cliente;
}
