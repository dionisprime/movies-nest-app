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
import { AuthService } from '../auth/auth.service';
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlaylistService } from 'src/playlist/playlist.service';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@ApiTags('movie')
@ApiBearerAuth()
@Controller('movie')
export class MovieController {
  constructor(
    @InjectConnection() private connection: mongoose.Connection,
    private readonly playlistService: PlaylistService,
    private readonly movieService: MovieService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    await this.authService.isAdmin(authorizationHeader);
    return this.movieService.create(createMovieDto);
  }

  @Public()
  @Get()
  findAll(@Headers('Authorization') authorizationHeader: string) {
    if (authorizationHeader) {
      return this.movieService.findAll();
    } else {
      return this.movieService.findNamesOnly();
    }
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
    await this.authService.isAdmin(authorizationHeader);
    return this.movieService.update(_id, updateMovieDto);
  }

  @Delete(':_id')
  async remove(
    @Param('_id') _id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    await this.authService.isAdmin(authorizationHeader);
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const deletedMovie = await this.movieService.remove(_id);
      await this.playlistService.removeMovieFromAllPlaylists(_id, session);
      await session.commitTransaction();
      return `Фильм ${deletedMovie} удален из базы и плейлистов`;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
