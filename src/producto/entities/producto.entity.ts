import { Categoria } from "src/categoria/entities/categoria.entity";
import { DetallePedido } from "src/detalle-pedidos/entities/detalle-pedido.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Producto {
  @Column({ generated: true, primary: true })
  id: number;
  @Column()
  nombre: string;
  @Column({ type: "decimal" })
  precio: number;
  @Column()
  cantidadStock: number;
  @Column()
  unidad_medida: string;
  @Column()
  estado: string;
  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    eager: true,
  })
  categoria: Categoria;
  @OneToMany(() => DetallePedido, (detalle) => detalle.id)
  detallePedidos: DetallePedido[];
}
