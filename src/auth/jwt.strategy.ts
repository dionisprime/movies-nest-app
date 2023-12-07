import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: true,
    });
  }

  // async validate(payload: any) {
  //   return console.log({ userId: payload.sub, username: payload.username });
  // }

  async validate(payload: { email: string }) {
    const { email } = payload;
    console.log('payload: ', payload);
    return this.userService.findByEmail(email);
  }
}
