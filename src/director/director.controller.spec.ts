import { Test, TestingModule } from '@nestjs/testing';
import { DirectorController } from './director.controller';
import { DirectorService } from './director.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Director, DirectorSchema } from './director.schema';
import { AuthService } from '../auth/auth.service';
import { Playlist, PlaylistSchema } from '../playlist/playlist.schema';
import { User, UserSchema } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

describe('DirectorController', () => {
  let controller: DirectorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([
          { name: Director.name, schema: DirectorSchema },
          { name: Playlist.name, schema: PlaylistSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      controllers: [DirectorController],
      providers: [
        DirectorService,
        AuthService,
        JwtService,
        ConfigService,
        UserService,
        MailService,
      ],
    }).compile();

    controller = module.get<DirectorController>(DirectorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
