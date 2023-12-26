import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreModule } from './genre/genre.module';
import { DirectorModule } from './director/director.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { PlaylistModule } from './playlist/playlist.module';
import { ReportModule } from './report/report.module';
import { DB_CONNECTION_URL } from '../utils/config';
import { MailModule } from './mail/mail.module';
import { RolesGuard } from './auth/guards/roles.guard';

const globalGuard = {
  provide: APP_GUARD,
  useClass: JwtGuard,
};

const rolesGuard = {
  provide: APP_GUARD,
  useClass: RolesGuard,
};

@Module({
  imports: [
    MovieModule,
    MongooseModule.forRoot(DB_CONNECTION_URL),
    GenreModule,
    DirectorModule,
    UserModule,
    ConfigModule.forRoot(),
    AuthModule,
    PlaylistModule,
    ReportModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, globalGuard, rolesGuard],
})
export class AppModule {}
