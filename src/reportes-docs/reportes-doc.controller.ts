import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as XLSXPopulate from 'xlsx-populate';
import { ReportsService } from './reportes-doc.service';

@Controller('reportes-doc')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('inventario')
  async generateInventoryReport(@Res() res: Response) {
    // Obtener los datos de inventario desde el servicio
    const inventoryData = await this.reportsService.getInventoryData();

    // Crear un nuevo archivo Excel
    const workbook = await XLSXPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    // Aplicar alineación centrada para todas las columnas
    sheet.column('A').style({ horizontalAlignment: 'center' });

    // Título del reporte
    sheet.cell('A1').value('Reporte de Inventario').style({
      fontSize: 16,         // Tamaño de fuente
      bold: true,           // Negrita
      horizontalAlignment: 'center',  // Alineación horizontal
      fill: 'FFFF00',      // Fondo amarillo en hexadecimal
    });

    // Combinar celdas para el título
    sheet.range('A1:E1').merged(true);

    // Estilo para las cabeceras del reporte
    sheet.range('A3:E3').style({
      fontSize: 12,         // Tamaño de fuente
      bold: true,           // Negrita
      horizontalAlignment: 'center',  // Alineación horizontal
      fill: 'ADD8E6',      // Fondo azul claro en hexadecimal
      border: true,         // Bordes alrededor de las celdas
    });

    // Crear la cabecera del reporte
    sheet.cell('A3').value('ID');
    sheet.cell('B3').value('Nombre');
    sheet.cell('C3').value('Categoría');
    sheet.cell('D3').value('Stock');
    sheet.cell('E3').value('Precio Unitario');

    // Agregar los datos de inventario
    inventoryData.forEach((product, index) => {
      const row = index + 4;

      // Agregar datos en las celdas
      sheet.cell(`A${row}`).value(product.id);
      sheet.cell(`B${row}`).value(product.nombre);
      sheet.cell(`C${row}`).value(product.categoria?.nombre || "Sin categoría");
      sheet.cell(`D${row}`).value(product.cantidadStock).style({
        horizontalAlignment: 'center',
      });
      sheet.cell(`E${row}`).value(product.precio).style({
        horizontalAlignment: 'center',
      })

      // Agregar bordes a las celdas
      sheet.range(`A${row}:E${row}`).style({
        border: true,
      });
    });

    // Ajustar el ancho de las columnas
    sheet.column('A').width(15);
    sheet.column('B').width(35);
    sheet.column('C').width(25);
    sheet.column('D').width(15);
    sheet.column('E').width(20);

    // Aplicar bordes a todas las celdas de la tabla (desde A3 hasta F{última fila})
    const lastRow = inventoryData.length + 3;
    sheet.range(`A3:E${lastRow}`).style({
      border: true,  // Bordes alrededor de todas las celdas
    });

    // Enviar el archivo Excel como respuesta
    res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    workbook.outputAsync().then((data) => res.send(data));
  }


  @Get('clientes')
  async generateClientesReport(@Res() res: Response) {
    // Obtener los datos de clientes desde el servicio
    const clientesData = await this.reportsService.getClientesData();

    // Crear un nuevo archivo Excel
    const workbook = await XLSXPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    // Título del reporte
    sheet.cell('A1').value('Clientes').style({
      fontSize: 16,         // Tamaño de fuente
      bold: true,           // Negrita
      horizontalAlignment: 'center',  // Alineación horizontal
      fill: 'FFFF00',      // Fondo amarillo en hexadecimal
    });
    // Combinar celdas para el título
    sheet.range('A1:F1').merged(true);

    // Crear la cabecera del reporte
    sheet.cell('A3').value('DNI');
    sheet.cell('B3').value('Nombre');
    sheet.cell('C3').value('Email');
    sheet.cell('D3').value('Teléfono');
    sheet.cell('E3').value('Dirección');
    sheet.cell('F3').value('RUC');

    sheet.range('A3:F3').style({
      fontSize: 12,         // Tamaño de fuente
      bold: true,           // Negrita
      horizontalAlignment: 'center',  // Alineación horizontal
      fill: 'ADD8E6',      // Fondo azul claro en hexadecimal
      border: true,         // Bordes alrededor de las celdas
    });

    // Agregar los datos de clientes
    clientesData.forEach((cliente, index) => {
      const row = index + 4;
      sheet.cell(`A${row}`).value(cliente.dni);
      sheet.cell(`B${row}`).value(cliente.nombre);
      sheet.cell(`C${row}`).value(cliente.email);
      sheet.cell(`D${row}`).value(cliente.telefono);
      sheet.cell(`E${row}`).value(cliente.direccion);
      sheet.cell(`F${row}`).value(cliente.ruc || 'N/A');
    });

    // Ajustar el ancho de las columnas
    sheet.column('A').width(15);
    sheet.column('B').width(25);
    sheet.column('C').width(30);
    sheet.column('D').width(20);
    sheet.column('E').width(40);
    sheet.column('F').width(20);

    const lastRow = clientesData.length + 3;
    sheet.range(`A3:F${lastRow}`).style({
      border: true,  // Bordes alrededor de todas las celdas
    });
    // Enviar el archivo Excel como respuesta
    res.setHeader('Content-Disposition', 'attachment; filename=clientes_report.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    workbook.outputAsync().then((data) => res.send(data));
  }

  @Get('pedidos')
  async generatePedidosReport(@Res() res: Response) {
    // Datos de pedidos
    const pedidosData = await this.reportsService.getPedidosRegistradosData();
    const allPedidosData = await this.reportsService.getAllPedidosData();

    // Crear un nuevo archivo Excel
    const workbook = await XLSXPopulate.fromBlankAsync();

    // Crear hoja para pedidos "Registrado"
    const sheet1 = workbook.sheet(0);
    sheet1.name("Registrados");

    sheet1.cell('A3').value('ID Pedido');
    sheet1.cell('B3').value('Fecha de Pedido');
    sheet1.cell('C3').value('Estado');
    sheet1.cell('D3').value('Total');
    sheet1.cell('E3').value('Cliente');
    sheet1.cell('F3').value('Direccion');

    // Título del reporte
    sheet1.cell('A1').value('Pedidos Pendientes').style({
      fontSize: 16,         // Tamaño de fuente
      bold: true,           // Negrita
      horizontalAlignment: 'center',  // Alineación horizontal
      fill: 'FFFF00',      // Fondo amarillo en hexadecimal
    });
    // Combinar celdas para el título
    sheet1.range('A1:F1').merged(true);

    sheet1.range('A3:F3').style({
      fontSize: 12,         // Tamaño de fuente
      bold: true,           // Negrita
      horizontalAlignment: 'center',  // Alineación horizontal
      fill: 'ADD8E6',      // Fondo azul claro en hexadecimal
      border: true,         // Bordes alrededor de las celdas
    });

    pedidosData.forEach((pedido, index) => {
      const row = index + 4;
      sheet1.cell(`A${row}`).value(pedido.id).style({
        horizontalAlignment: 'center',
      });;
      sheet1.cell(`B${row}`).value(pedido.fecha_pedido.toLocaleString());
      sheet1.cell(`C${row}`).value(pedido.estado);
      sheet1.cell(`D${row}`).value(pedido.total).style({
        horizontalAlignment: 'center',
      });;
      sheet1.cell(`E${row}`).value(pedido.cliente?.nombre).style({
        horizontalAlignment: 'center',
      });;
      sheet1.cell(`F${row}`).value(pedido.cliente?.direccion);
    });

    // Ancho de las columnas
    sheet1.column('A').width(15);
    sheet1.column('B').width(25);
    sheet1.column('C').width(20);
    sheet1.column('D').width(20);
    sheet1.column('E').width(25);
    sheet1.column('F').width(25);

    const lastRow = pedidosData.length + 3;
    sheet1.range(`A3:F${lastRow}`).style({
      border: true,  // Bordes alrededor de todas las celdas
    });

    // Crear hoja para todos los pedidos
    const sheet2 = workbook.addSheet("Todos los Pedidos");

    sheet2.cell('A3').value('ID Pedido');
    sheet2.cell('B3').value('Fecha de Pedido');
    sheet2.cell('C3').value('Estado');
    sheet2.cell('D3').value('Total');
    sheet2.cell('E3').value('Cliente');
    sheet2.cell('F3').value('Direccion');

    allPedidosData.forEach((pedido, index) => {
      const row = index + 4;
      sheet2.cell(`A${row}`).value(pedido.id).style({
        horizontalAlignment: 'center',
      });
      sheet2.cell(`B${row}`).value(pedido.fecha_pedido.toLocaleString());
      sheet2.cell(`C${row}`).value(pedido.estado);
      sheet2.cell(`D${row}`).value(pedido.total).style({
        horizontalAlignment: 'center',
      });
      sheet2.cell(`E${row}`).value(pedido.cliente?.nombre);
      sheet2.cell(`F${row}`).value(pedido.cliente?.direccion);
    });

    // Título del reporte
    sheet2.cell('A1').value('Historial de Pedidos').style({
      fontSize: 16,         // Tamaño de fuente
      bold: true,           // Negrita
      horizontalAlignment: 'center',  // Alineación horizontal
      fill: 'FFFF00',      // Fondo amarillo en hexadecimal
    });
    
    // Combinar celdas para el título
    sheet2.range('A1:F1').merged(true);

    sheet2.range('A3:F3').style({
      fontSize: 12,         // Tamaño de fuente
      bold: true,           // Negrita
      horizontalAlignment: 'center',  // Alineación horizontal
      fill: 'ADD8E6',      // Fondo azul claro en hexadecimal
      border: true,         // Bordes alrededor de las celdas
    });

    // Ancho de las columnas
    sheet2.column('A').width(15);
    sheet2.column('B').width(25);
    sheet2.column('C').width(20);
    sheet2.column('D').width(20);
    sheet2.column('E').width(25);
    sheet2.column('F').width(25);

    const lastRow2 = allPedidosData.length + 3;
    sheet2.range(`A3:F${lastRow2}`).style({
      border: true,  // Bordes alrededor de todas las celdas
    });

    // Enviar el archivo Excel como respuesta
    res.setHeader('Content-Disposition', 'attachment; filename=pedidos_report.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    workbook.outputAsync().then((data) => res.send(data));
  }
}
