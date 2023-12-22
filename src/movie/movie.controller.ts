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
  // HttpStatus,
  // Query,
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
import { UserDocument } from 'src/user/user.schema';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Permissions } from '../enums/permissions.enum';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from '@fast-csv/format';

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
  @Get('export/:format')
  async exportData(
    @Res() res: Response,
    @Param('format') format: 'json' | 'csv',
    @Res() response: Response,
  ) {
    const movies = await this.movieService.findAll();
    if (format === 'csv') {
      const ws = fs.createWriteStream('movies.csv');
      const fileName = 'movies.csv';
      csv.writeToStream(ws, movies, { headers: true });
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileName}`,
      );
      response.setHeader('Content-Type', 'text/csv');
      response.send(movies);
    }
    if (format === 'json' || format === undefined) {
      const dataString = JSON.stringify(movies);
      const fileName = 'films.json';
      const filePath = path.join(__dirname, '../../', 'films.json');
      await fs.promises.writeFile(filePath, dataString, 'utf8');

      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileName}`,
      );
      response.setHeader('Content-Type', 'application/json');
      // res.send(dataString);
      response.sendFile(filePath);
    }
  }

  // @Get('export/:format')
  // async exportMovies(
  //   @Param('format') format: 'json' | 'csv',
  //   // @Res() response: Response,
  // ) {
  //   const data = await this.movieService.exportMovies(format);
  //   return { data };
  //   // const filename = `movies.${format}`;
  //   // response.setHeader(
  //   //   'Content-Type',
  //   //   format === 'json' ? 'application/json' : 'text/csv',
  //   // );
  //   // response.setHeader(
  //   //   'Content-Disposition',
  //   //   `attachment; filename=${filename}`,
  //   // );

  //   // return response.send(data);
  // }

  // @Public()
  // @Get('/file')
  // async getFilms(@Res() response: Response) {
  //   const films = await this.movieService.findAll();
  //   const filmsJSON = JSON.stringify(films);

  //   await fs.promises.writeFile('films.json', filmsJSON, 'utf8');
  //   const fileName = 'films.json';
  //   const filePath = path.join(__dirname, '../../', 'films.json');
  //   response.setHeader('Content-Type', 'application/octet-stream');
  //   response.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=${fileName}`,
  //   );
  //   response.sendFile(filePath);

  //   return HttpStatus.CREATED;
  // }

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
