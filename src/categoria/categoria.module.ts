import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from 'src/producto/entities/producto.entity';
import { Categoria } from './entities/categoria.entity';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService], 
   imports:[TypeOrmModule.forFeature([Producto,Categoria])],
   exports:[CategoriaModule]
})
export class CategoriaModule {}
