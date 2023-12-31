import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movie.schema';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { User, UserSchema } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Playlist, PlaylistSchema } from '../playlist/playlist.schema';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { PlaylistService } from '../playlist/playlist.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: User.name, schema: UserSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  controllers: [MovieController, AuthController],
  providers: [
    MovieService,
    AuthService,
    JwtService,
    ConfigService,
    MailService,
    UserService,
    PlaylistService,
  ],
})
export class MovieModule {}
