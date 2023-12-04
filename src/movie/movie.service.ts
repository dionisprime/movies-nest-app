import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ERROR_MESSAGE } from '../../utils/constants';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    return createdMovie.save();
  }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
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

    return existingMovie.save();
  }

  async remove(_id: string): Promise<Movie> {
    const deletedMovie = await this.movieModel.findByIdAndDelete(_id);

    if (!deletedMovie) {
      throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
    }

    return deletedMovie;
  }
}
