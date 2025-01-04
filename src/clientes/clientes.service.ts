import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { getRepository, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ClientesService {
  constructor( @InjectRepository(Cliente) private readonly clienteRespository:Repository<Cliente>   ){

  }
  create(createClienteDto: CreateClienteDto) {
    return this.clienteRespository.save(createClienteDto)
  }

  findAll() {
    return this.clienteRespository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} cliente`;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const cliente=await this.clienteRespository.findOneBy({id})
    if(!cliente){
      throw new BadRequestException("cliente no existe")
    }
    return  await this.clienteRespository.update(id,updateClienteDto)
   }

  remove(id: string) {
console.log(id)
    return this.clienteRespository.delete(id);
  }

  async getResumenClientes() {
    const totalClientes = await this.clienteRespository.count();
    const clientesActivos = await this.clienteRespository.count({ where: { activo: true } });
    const nuevosEsteMes = await this.clienteRespository.count({
      where: { createdAt: MoreThanOrEqual(new Date(new Date().setDate(1))) },
    });
    const tasaAbandono = await this.clienteRespository.count({
      where: { activo: false, updatedAt: MoreThanOrEqual(new Date(new Date().setDate(1))) },
    });

    const totalClientesMesAnterior = await this.clienteRespository.count({
      where: { createdAt: MoreThanOrEqual(new Date(new Date().setMonth(new Date().getMonth() - 1))) },
    });

    const porcentajeVsMesAnterior = totalClientesMesAnterior
      ? ((totalClientes - totalClientesMesAnterior) / totalClientesMesAnterior) * 100
      : 0;

    return {
      totalClientes,
      clientesActivos,
      nuevosEsteMes,
      tasaAbandono,
      porcentajeVsMesAnterior,
    };
  }
}
