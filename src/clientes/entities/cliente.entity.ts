import { Pedido } from "src/pedidos/entities/pedido.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    email: string;

    @Column()
    telefono: string;

    @Column()
    direccion: string;

    @Column({ nullable: true })
    dni: string;

    @Column({ nullable: true })
    ruc: string;

    @OneToMany(() => Pedido, (pedido) => pedido.cliente)
    pedidos: Pedido[];
}
