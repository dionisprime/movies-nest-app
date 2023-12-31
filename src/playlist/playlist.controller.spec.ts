import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from '../playlist/playlist.schema';
import { User, UserSchema } from '../user/user.schema';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';

describe('PlaylistController', () => {
  let controller: PlaylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Playlist.name, schema: PlaylistSchema },
        ]),
      ],
      controllers: [PlaylistController],
      providers: [
        PlaylistService,
        AuthService,
        JwtService,
        ConfigService,
        UserService,
        MailService,
      ],
    }).compile();

    controller = module.get<PlaylistController>(PlaylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
