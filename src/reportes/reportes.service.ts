import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pedido } from "../pedidos/entities/pedido.entity";
import { DetallePedido } from "../detalle-pedidos/entities/detalle-pedido.entity";

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido)
    private readonly detallePedidoRepository: Repository<DetallePedido>
  ) {}

  async obtenerVentasDeHoy(): Promise<any> {
    const hoy = new Date();
    const inicioDelDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );
    const finDelDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + 1
    );

    const ventasHoy = await this.pedidoRepository
      .createQueryBuilder("pedido")
      .leftJoinAndSelect("pedido.detallePedidos", "detalle")
      .where("pedido.fecha_pedido >= :inicioDelDia", { inicioDelDia })
      .andWhere("pedido.fecha_pedido < :finDelDia", { finDelDia })
      .getMany();

    return ventasHoy;
  }

  async obtenerVentasUltimos30Dias(): Promise<any> {
    const hoy = new Date();
    const hace30Dias = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() - 30
    );

    const inicioDelDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );

    const ventasUltimos30Dias = await this.pedidoRepository
      .createQueryBuilder("pedido")
      .leftJoinAndSelect("pedido.detallePedidos", "detalle")
      .where("pedido.fecha_pedido >= :hace30Dias", { hace30Dias })
      .andWhere("pedido.fecha_pedido < :inicioDelDia", { inicioDelDia })
      .getMany();

    return ventasUltimos30Dias;
  }

  async obtenerVentas2años(): Promise<any> {
    // Ejecutar la consulta SQL
    const resultados = await this.pedidoRepository.query(`
      SELECT
        TO_CHAR(pedido.fecha_pedido, 'Mon') AS mes,
        EXTRACT(YEAR FROM pedido.fecha_pedido) AS año,
        SUM(pedido.total) AS ganancia
      FROM pedido
      WHERE pedido.fecha_pedido >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'
        AND pedido.fecha_pedido < DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'
      GROUP BY mes, año
      ORDER BY año, mes;
    `);

    console.log("Resultados de la consulta:", resultados);

    const añoActual = new Date().getFullYear();
    const añoPasado = añoActual - 1;

    const ganancias: { [key: number]: { [key: string]: number } } = {
      [añoPasado]: {},
      [añoActual]: {},
    };

    // Asignar las ganancias a los años correspondientes
    resultados.forEach(({ mes, año, ganancia }) => {
      const añoNumero = parseInt(año, 10);
      if (añoNumero === añoPasado) {
        ganancias[añoPasado][mes] = ganancia;
      } else if (añoNumero === añoActual) {
        ganancias[añoActual][mes] = ganancia;
      }
    });

    // Generar el formato requerido
    const meses = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const resultadoFormato = meses.map((mes) => ({
      date: mes.slice(0, 3),
      [añoPasado.toString()]: ganancias[añoPasado][mes] || 0,
      [añoActual.toString()]: ganancias[añoActual][mes] || 0,
    }));

    return resultadoFormato;
  }

  async obtenerVentasGaseosasTipo7dias(): Promise<any> {
    const pedidos7dias = await this.pedidoRepository
      .createQueryBuilder("pedido")
      .leftJoinAndSelect("pedido.detallePedidos", "detalle")
      .leftJoinAndSelect("detalle.producto", "producto")
      .leftJoinAndSelect("producto.categoria", "categoria")
      .where("pedido.fecha_pedido >= CURRENT_DATE - INTERVAL '7 days'")
      .andWhere("pedido.fecha_pedido < CURRENT_DATE + INTERVAL '2 day'")
      .getMany();

    console.log(pedidos7dias);

    const categoriasGaseosas = [
      "Soda Limon",
      "Kola T. oro",
      "Kola T. piña",
      "Kola T. roja",
      "Kola T. negra",
      "Kola T. guarana",
      "Kola T. naranja",
    ];
    const unidadesMedida = ["450ml", "2L", "1.1L", "3L"];

    const resultado = pedidos7dias.reduce((acc, pedido) => {
      pedido.detallePedidos.forEach((detalle) => {
        const producto = detalle.producto;
        const categoriaNombre = producto.categoria.nombre;
        const unidadMedida = producto.unidad_medida;
        const cantidad = detalle.cantidad;

        // Verificar si la categoría está en las categorías de gaseosas
        if (categoriasGaseosas.includes(categoriaNombre)) {
          // Si la categoría no está en el acumulador, inicializarla
          if (!acc[categoriaNombre]) {
            acc[categoriaNombre] = {};
          }

          // Si la unidad de medida no está en la categoría, inicializarla
          if (!acc[categoriaNombre][unidadMedida]) {
            acc[categoriaNombre][unidadMedida] = 0;
          }

          // Sumar la cantidad al acumulador
          acc[categoriaNombre][unidadMedida] += cantidad;
        }
      });
      return acc;
    }, {});

    categoriasGaseosas.forEach((categoria) => {
      if (!resultado[categoria]) {
        resultado[categoria] = {};
      }

      unidadesMedida.forEach((unidad) => {
        if (!(unidad in resultado[categoria])) {
          resultado[categoria][unidad] = 0;
        }
      });
    });
    const chartdata = categoriasGaseosas.map((categoria) => {
      const dataCategoria = { name: categoria, Total: 0 };
      let total = 0;

      // Agregar cada unidad de medida como clave en el objeto
      unidadesMedida.forEach((unidad) => {
        const cantidad = resultado[categoria][unidad] || 0;
        dataCategoria[unidad] = cantidad;
        total += cantidad; // Sumar la cantidad al total
      });

      dataCategoria.Total = total; // Agregar el total al objeto

      return dataCategoria;
    });
    console.log(chartdata);
    return chartdata;
  }
}
