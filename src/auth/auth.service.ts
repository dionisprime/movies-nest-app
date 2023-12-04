import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { ERROR_MESSAGE, ROLES } from '../../utils/constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateToken(email: string) {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }

    const token = this.jwtService.sign({ email }, { secret });
    return token;
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

    const jwtToken = authorizationHeader.split(' ')[1];

    const user = await this.userModel.findOne({ token: jwtToken }).exec();
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const email = user?.email;
    const password = user?.password;
    await this.authenticate(email, password);

    return user;
  }

  async isAdmin(authorizationHeader: string) {
    if (!authorizationHeader) {
      throw new UnauthorizedException(ERROR_MESSAGE.AUTH_HEADER_MISSING);
    }

    const user = await this.isAuth(authorizationHeader);

    const isAdmin = user?.roles.includes(ROLES.ADMIN);
    if (!isAdmin) {
      throw new ForbiddenException(ERROR_MESSAGE.NOT_ADMIN);
    }
  }
}
