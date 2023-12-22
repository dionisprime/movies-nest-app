import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { AuthService } from '../auth/auth.service';
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@ApiTags('genre')
@ApiBearerAuth()
@Controller('genre')
export class GenreController {
  constructor(
    private readonly genreService: GenreService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Public()
  @Get()
  findAll(@Headers('Authorization') authorizationHeader: string) {
    if (authorizationHeader) {
      return this.genreService.findAll();
    } else {
      return this.genreService.findNamesOnly();
    }
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.genreService.findOne(_id);
  }

  @Patch(':_id')
  @Roles(Role.Admin)
  async update(
    @Param('_id') _id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genreService.update(_id, updateGenreDto);
  }

  @Delete(':_id')
  @Roles(Role.Admin)
  async remove(@Param('_id') _id: string) {
    return this.genreService.remove(_id);
  }
}
