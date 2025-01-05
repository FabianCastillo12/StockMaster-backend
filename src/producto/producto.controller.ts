import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';


@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post("/crear")
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }
 
  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @Get('low-stock/:threshold')
  async countLowStock(@Param('threshold') threshold: number) {
    const count = await this.productoService.countLowStock(+threshold);
    return { lowStockCount: count };
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    console.log(id)
    return this.productoService.remove(+id);
  }
}
