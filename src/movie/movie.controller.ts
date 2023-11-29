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
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UserService } from 'src/user/user.service';

@Controller('movie')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    await this.userService.isAuth(authorizationHeader);
    return this.movieService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.movieService.findOne(_id);
  }

  @Patch(':_id')
  async update(
    @Param('_id') _id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    await this.userService.isAuth(authorizationHeader);
    return this.movieService.update(_id, updateMovieDto);
  }

  @Delete(':_id')
  async remove(
    @Param('_id') _id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    await this.userService.isAuth(authorizationHeader);
    return this.movieService.remove(_id);
  }
}
