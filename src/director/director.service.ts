import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Director, DirectorDocument } from './director.schema';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { ERROR_MESSAGE } from '../../utils/constants';

@Injectable()
export class DirectorService {
  constructor(
    @InjectModel(Director.name) private directorModel: Model<DirectorDocument>,
  ) {}

  async create(createDirectorDto: CreateDirectorDto): Promise<Director> {
    const createdDirector = new this.directorModel(createDirectorDto);
    return createdDirector.save();
  }

  async findAll(): Promise<Director[]> {
    return this.directorModel.find().exec();
  }

  async findOne(_id: string): Promise<Director> {
    const director = await this.directorModel.findById(_id).exec();
    if (!director) {
      throw new NotFoundException(ERROR_MESSAGE.DIRECTOR_NOT_FOUND);
    }
    return director;
  }

  async update(
    _id: string,
    updateDirectorDto: UpdateDirectorDto,
  ): Promise<Director> {
    const updatedDirector = await this.directorModel.findById(_id);

    if (!updatedDirector) {
      throw new NotFoundException(ERROR_MESSAGE.DIRECTOR_NOT_FOUND);
    }

    updatedDirector.set(updateDirectorDto);

    return updatedDirector.save();
  }

  async remove(_id: string) {
    const deletedDirector = await this.directorModel.findByIdAndDelete(_id);
    if (!deletedDirector) {
      throw new NotFoundException(ERROR_MESSAGE.DIRECTOR_NOT_FOUND);
    }
    return deletedDirector;
  }
}
