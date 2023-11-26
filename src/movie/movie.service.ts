import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { DeleteMovieDto } from './dto/delete-movie.dto';

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

  findOne(_id: string) {
    return this.movieModel.findById(_id).exec();
  }

  async update(_id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieModel.findById(_id);

    if (!existingMovie) {
      throw new NotFoundException(`Movie with ID ${_id} not found`);
    }

    existingMovie.set(updateMovieDto);

    return existingMovie.save();
  }

  async remove(deleteMovieDto: DeleteMovieDto): Promise<Movie> {
    const deleteMovieId = deleteMovieDto._id;
    const deletedMovie = await this.movieModel.findByIdAndDelete(deleteMovieId);

    if (!deletedMovie) {
      throw new NotFoundException(`Movie with ID ${deleteMovieId} not found`);
    }

    return deletedMovie;
  }
}
