import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { Report, ReportSchema } from '../report/report.schema';
import { Movie, MovieSchema } from '../movie/movie.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieService } from '../movie/movie.service';
import { PlaylistService } from '../playlist/playlist.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { Playlist, PlaylistSchema } from '../playlist/playlist.schema';
import { User, UserSchema } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([
          { name: Playlist.name, schema: PlaylistSchema },

          { name: Movie.name, schema: MovieSchema },
          { name: Report.name, schema: ReportSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      providers: [
        ReportService,
        MovieService,
        PlaylistService,
        UserService,
        MailService,
        JwtService,
        AuthService,
        ConfigService,
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
