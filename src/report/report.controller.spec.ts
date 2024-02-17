import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from '../report/report.schema';
import { MovieService } from '../movie/movie.service';
import { UserService } from '../user/user.service';
import { PlaylistService } from '../playlist/playlist.service';
import { MailService } from '../mail/mail.service';
import { Movie, MovieSchema } from '../movie/movie.schema';
import { AuthService } from '../auth/auth.service';
import { Playlist, PlaylistSchema } from '../playlist/playlist.schema';
import { User, UserSchema } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ReportController', () => {
  let controller: ReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([
          { name: Report.name, schema: ReportSchema },
          { name: Movie.name, schema: MovieSchema },
          { name: User.name, schema: UserSchema },
          { name: Playlist.name, schema: PlaylistSchema },
        ]),
      ],
      controllers: [ReportController],
      providers: [
        ReportService,
        MovieService,
        PlaylistService,
        UserService,
        MailService,
        AuthService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
