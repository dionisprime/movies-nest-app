import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ERROR_MESSAGE } from '../../utils/constants';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const createdGenre = new this.genreModel(createGenreDto);
    return createdGenre.save();
  }

  async findAll(): Promise<Genre[]> {
    return this.genreModel.find().exec();
  }

  async findOne(_id: string): Promise<Genre> {
    const genre = await this.genreModel.findById(_id).exec();
    if (!genre) {
      throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
    }
    return genre;
  }

  async update(_id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const updatedGenre = await this.genreModel.findById(_id);

    if (!updatedGenre) {
      throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
    }

    updatedGenre.set(updateGenreDto);

    return updatedGenre.save();
  }

  async remove(_id: string) {
    const deletedGenre = await this.genreModel.findByIdAndDelete(_id);
    if (!deletedGenre) {
      throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
    }
    return deletedGenre;
  }
}
