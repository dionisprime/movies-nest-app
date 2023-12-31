import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { AuthService } from '../auth/auth.service';
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@ApiTags('director')
@ApiBearerAuth()
@Controller('director')
export class DirectorController {
  constructor(
    private readonly directorService: DirectorService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createDirectorDto: CreateDirectorDto) {
    return this.directorService.create(createDirectorDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.directorService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.directorService.findOne(_id);
  }

  @Patch(':_id')
  @Roles(Role.Admin)
  async update(
    @Param('_id') _id: string,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ) {
    return this.directorService.update(_id, updateDirectorDto);
  }

  @Delete(':_id')
  @Roles(Role.Admin)
  async remove(@Param('_id') _id: string) {
    return this.directorService.remove(_id);
  }
}
