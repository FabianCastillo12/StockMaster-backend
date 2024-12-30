import { Column, Entity } from 'typeorm';
import { ROLES } from '../enum/role.auth';
@Entity()
export class Auth {
  @Column({ primary: true, generated: true })
  id: number;
  @Column()
  nombre: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({type:"enum" ,default:ROLES.USER,enum:ROLES})
  role:string
}
