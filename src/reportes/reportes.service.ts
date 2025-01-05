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

}
