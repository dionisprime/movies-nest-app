import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from '../playlist/playlist.schema';
import { User, UserSchema } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Playlist.name, schema: PlaylistSchema },
        ]),
      ],
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        UserService,
        MailService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
