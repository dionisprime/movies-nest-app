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
import { Playlist, PlaylistDocument } from '../playlist/playlist.schema';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { RolePermissions } from '../enums/rolePermissions.enum';
import { Permissions } from '../enums/permissions.enum';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async login(authDto: AuthDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: authDto.email }).exec();
    if (!user) throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    if (user.password !== authDto.password)
      throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIALS);
    return user;
  }

  async generateToken(_id: string, email: string, roles: string[]) {
    const secret = this.configService.get('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }

    const token = this.jwtService.sign({ _id, email, roles }, { secret });
    return token;
  }

  async sendMagicLink(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const clientUrl = this.configService.get('CLIENT_URL');

    const token = this.generateToken(
      user._id.toString(),
      user.email,
      user.roles,
    );

    const link = `${clientUrl}/auth/${token}`;
    const html = `<p><a href="${link}">Войти в аккаунт</a></p>`;

    this.mailService.sendMessage({
      email: user.email,
      subject: 'Волшебная ссылка для входа',
      html,
    });
    return `Ссылка отправлена на почту ${email}`;
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
    return isAdmin;
  }

  async isOwner(_id: string, user: UserDocument) {
    const userFromToken = user;

    const playlist = await this.playlistModel.findById(_id).exec();
    if (!playlist) {
      throw new NotFoundException(ERROR_MESSAGE.PLAYLIST_NOT_FOUND);
    }

    const userPlaylistOwner = await this.userModel
      .findById(playlist?.createdBy)
      .exec();

    const isPlaylistOwner = userFromToken?.email === userPlaylistOwner?.email;

    if (!isPlaylistOwner) {
      throw new ForbiddenException(ERROR_MESSAGE.NO_PERMISSIONS);
    }
    return isPlaylistOwner;
  }

  checkPermission(user: UserDocument, permission: Permissions) {
    const hasPermission = user.roles.some((role) =>
      RolePermissions[role].includes(permission),
    );
    if (!hasPermission)
      throw new ForbiddenException(ERROR_MESSAGE.NO_PERMISSIONS);
    return hasPermission;
  }
}
