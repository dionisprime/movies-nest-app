import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async authenticate(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIALS);
    }
    return user;
  }

  async isAuth(authorizationHeader: string) {
    if (!authorizationHeader) {
      throw new UnauthorizedException(ERROR_MESSAGE.AUTH_HEADER_MISSING);
    }
    const [email, password] = authorizationHeader.split(' ');

    const user = await this.authenticate(email, password);
    return user;
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
}
