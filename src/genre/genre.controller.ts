import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Public } from '../decorators/public.decorator';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.genreService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.genreService.findOne(_id);
  }

  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(_id, updateGenreDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.genreService.remove(_id);
  }
}
