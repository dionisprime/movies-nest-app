import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Req,
  Res,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthService } from '../auth/auth.service';
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlaylistService } from '../playlist/playlist.service';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { UserDocument } from '../user/user.schema';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Permissions } from '../enums/permissions.enum';
import { Response } from 'express';

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
    @Req() req: Request & { user: UserDocument },
  ) {
    const { user } = req;
    console.log('user: ', user);
    this.authService.checkPermission(user, Permissions.MANAGE_REVIEWS);
    return this.movieService.create(createMovieDto);
  }

  @Public()
  @Get('export/json')
  async exportMoviesJson(@Res() response: Response) {
    const movies = await this.movieService.findAll();
    const fileName = 'movies.json';

    response.setHeader('Content-Type', 'application/json');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}`,
    );
    response.send(JSON.stringify(movies));
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
  @Roles(Role.Admin)
  async update(
    @Param('_id') _id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.update(_id, updateMovieDto);
  }

  @Delete(':_id')
  @Roles(Role.Admin)
  async remove(@Param('_id') _id: string) {
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
