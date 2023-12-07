import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Director, DirectorSchema } from './director.schema';
import { AuthService } from 'src/auth/auth.service';
import { User, UserSchema } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Playlist, PlaylistSchema } from '../playlist/playlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Director.name, schema: DirectorSchema },
      { name: User.name, schema: UserSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  controllers: [DirectorController],
  providers: [DirectorService, AuthService, JwtService, ConfigService],
})
export class DirectorModule {}
