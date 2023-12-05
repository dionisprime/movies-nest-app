import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './genre.schema';
import { AuthService } from 'src/auth/auth.service';
import { User, UserSchema } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Genre.name, schema: GenreSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [GenreController],
  providers: [GenreService, AuthService, JwtService, ConfigService],
})
export class GenreModule {}
