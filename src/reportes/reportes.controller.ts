import { Controller, Get } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('ventas-hoy')
  async obtenerVentasDeHoy() {
    return this.reportesService.obtenerVentasDeHoy();
  }

  @Get('ventas-2-years')
  async obtenerVentas2años(){
    return this.reportesService.obtenerVentas2años();
  }

  @Get('ventas-30-dias')
  async obtenerVentasUltimos30Dias(){
    return this.reportesService.obtenerVentasUltimos30Dias();
  }

  @Get('ventas-categoria-semanal')
  async obtenerVentasGaseosasTipo7dias(){
    return this.reportesService.obtenerVentasGaseosasTipo7dias();
  }
}
