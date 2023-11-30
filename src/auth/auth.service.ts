import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { ERROR_MESSAGE } from '../../utils/constants';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
}
