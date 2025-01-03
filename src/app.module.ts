import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductoModule } from './producto/producto.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ClientesModule } from './clientes/clientes.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ReportesModule } from './reportes/reportes.module'
import { ReportesDocModule } from './reportes-docs/reportes-doc.module'

@Module({
  imports: [
    AuthModule,ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT), 
      username: process.env.DATABASE_USERNAME, 
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME, 
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.POSTGRES_SSL === "true",
      extra: {
        ssl:
          process.env.POSTGRES_SSL === "true"
            ? {
                rejectUnauthorized: false,
              }
            : null,
      },
    }),
    ProductoModule,
    CategoriaModule,
    ClientesModule,
    PedidosModule,
    ReportesModule,
    ReportesDocModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}