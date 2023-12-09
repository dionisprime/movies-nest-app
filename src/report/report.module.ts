import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MovieService } from 'src/movie/movie.service';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './report.schema';
import { PlaylistService } from 'src/playlist/playlist.service';
import { Movie, MovieSchema } from 'src/movie/movie.schema';
import { Playlist, PlaylistSchema } from 'src/playlist/playlist.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    AuthService,
    MovieService,
    PlaylistService,
    UserService,
    JwtService,
    ConfigService,
  ],
})
export class ReportModule {}
