import { Producto } from "src/producto/entities/producto.entity"
import {Column, Entity, OneToMany} from "typeorm"
@Entity() 
export class Categoria {
@Column({generated:true,primary:true})
id:number
@Column()
nombre:string
@Column()
descripcion:string

@OneToMany(() => Producto, (producto) =>producto.id) // note: we will create author property in the Photo class below
productos: Producto[]


}
