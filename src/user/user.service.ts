import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGE } from '../../utils/constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGE.USER_ALREADY_EXIST);
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id).exec();
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }
    return user;
  }

  findByEmail(email: string) {
    const user = this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }
    return user;
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findById(_id);

    if (!updatedUser) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    updatedUser.set(updateUserDto);

    return updatedUser.save();
  }

  async remove(_id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(_id);
    if (!deletedUser) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }
    return deletedUser;
  }

  async removePlaylistFromUser(
    userId: string,
    playlistId: string,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const playlistIndex = user.playlists.indexOf(playlistId);

    if (playlistIndex === -1) {
      throw new NotFoundException(ERROR_MESSAGE.PLAYLIST_NOT_FOUND);
    }

    if (playlistIndex > -1) {
      user.playlists.splice(playlistIndex, 1);
      await user.save();
    }

    return user;
  }

  async countUsers() {
    return this.userModel.countDocuments().exec();
  }

  async subscribeToNotifications(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }
    user.isSubscribedToNotifications = true;
    return user.save();
  }

  async unsubscribeFromNotifications(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }
    user.isSubscribedToNotifications = false;
    return user.save();
  }

  async getSubscribers(): Promise<User[]> {
    return this.userModel.find({ isSubscribedToNotifications: true }).exec();
  }
}
