import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Movie, MovieDocument } from './movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ERROR_MESSAGE } from '../../utils/constants';
import * as NodeCache from 'node-cache';
import { PlaylistService } from 'src/playlist/playlist.service';

const movieCache = new NodeCache({ stdTTL: 600, checkperiod: 600 });

@Injectable()
export class MovieService {
  constructor(
    @InjectConnection() private connection: mongoose.Connection,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private readonly playlistService: PlaylistService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    const result = await createdMovie.save();
    movieCache.del('allMovies');
    return result;
  }

  async findAll(): Promise<Movie[]> {
    const cachedMovies = movieCache.get('allMovies') as Movie[];
    if (cachedMovies) {
      return cachedMovies;
    }

    const movies = await this.movieModel
      .find()
      .populate('genre')
      .populate('director')
      .exec();
    movieCache.set('allMovies', movies);
    return movies;
  }

  findNamesOnly() {
    return this.movieModel.find({}, 'title -_id').exec();
  }

  async findOne(_id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(_id).exec();
    if (!movie) {
      throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
    }
    return movie;
  }

  async update(_id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieModel.findById(_id);

    if (!existingMovie) {
      throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
    }

    existingMovie.set(updateMovieDto);

    const result = await existingMovie.save();
    movieCache.del('allMovies');
    return result;
  }

  async remove(_id: string): Promise<Movie | string> {
    const session = await this.movieModel.db.startSession();
    session.startTransaction();

    try {
      const deletedMovie = await this.movieModel.findByIdAndDelete(_id);

      if (!deletedMovie) {
        throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
      }

      await this.playlistService.removeMovieFromAllPlaylists(_id, session);

      await session.commitTransaction();

      movieCache.del('allMovies');
      return `Фильм ${deletedMovie} удален из базы и плейлистов`;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async countMovies() {
    return this.movieModel.countDocuments().exec();
  }
}
