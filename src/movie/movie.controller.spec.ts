import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movie.schema';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/user.schema';
import { PlaylistService } from '../playlist/playlist.service';
import { Playlist, PlaylistSchema } from '../playlist/playlist.schema';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('MovieController', () => {
  let controller: MovieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-db'),
        MongooseModule.forFeature([
          { name: Movie.name, schema: MovieSchema },
          { name: User.name, schema: UserSchema },
          { name: Playlist.name, schema: PlaylistSchema },
        ]),
      ],
      controllers: [MovieController],
      providers: [
        MovieService,
        UserService,
        MailService,
        PlaylistService,
        MovieService,
        AuthService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
