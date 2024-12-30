import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService
  ) {}

  async create({ password, email, nombre, confir_password ,role}: CreateAuthDto) {
    const user = await this.findOneEmail(email);
    if (user) {
      throw new BadRequestException("usuario existente ")
     
    }
    if (password !== confir_password) {
      throw new BadRequestException("la contraseña no coincide ")
     
    }
    return this.authRepository.save({ email, password:await bcrypt.hashSync(password,10), nombre,role });
  }
 async login(loginAuthDto:LoginAuthDto){
    const user=await this.findOneEmail(loginAuthDto.email)
    if(!user){
      throw new BadRequestException("credenciales incorrecto")
    }
    const verifiquePassword=await bcrypt.compareSync(loginAuthDto.password,user.password)
     if(!verifiquePassword){
      throw new BadRequestException("credenciales incorrecto")
     }
     const payload={email:user.email,rol:user.role,nombre:user.nombre}
     const token=await this.jwtService.signAsync(payload)

     return{
      msg:"usuario autenticado",
      token,
      email:user.email,
      user:user.nombre, 
      rol:user.role
     }

 }
  findAll() {
    return this.authRepository.find();
  }
  findOneEmail(email: string) {
    return this.authRepository.findOne({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

 async update(id: number, updateAuthDto: UpdateAuthDto) {
      const user=await this.authRepository.findOneBy({id})
        if(!user){
          throw new BadRequestException("usuario no existe")
        }
      return await this.authRepository.update(id,updateAuthDto)
      
  }

  async remove(id: number) {
    const user = await  this.authRepository.findOneBy({id})
    if(!user){
       throw new  BadRequestException("usuario no existe")
    }
  await this.authRepository.delete(id);
  return {
    msg:`usuario con el ${id} eliminado `
  }
  }
}
