import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreModule } from './genre/genre.module';
import { DirectorModule } from './director/director.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MovieModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-db'),
    GenreModule,
    DirectorModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
