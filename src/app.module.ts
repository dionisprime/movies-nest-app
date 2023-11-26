import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MovieModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-db'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
