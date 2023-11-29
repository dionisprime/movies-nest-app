import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movie.schema';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MovieController, UserController],
  providers: [MovieService, UserService],
})
export class MovieModule {}
