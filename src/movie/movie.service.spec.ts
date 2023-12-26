import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movie.schema';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { User, UserSchema } from '../user/user.schema';

describe('MovieService', () => {
  let service: MovieService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([
          { name: Movie.name, schema: MovieSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      providers: [MovieService, UserService, MailService],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be create a movie', async () => {
    const createMovieDto = {
      title: 'Example Movie',
      description: 'Excellent',
      year: 2022,
      duration: 123,
      genre: ['65633f3766fbc04c023dc83f'],
      director: '656353fd4e8227136c61cc96',
    };
    const createdMovie = await service.create(createMovieDto);

    expect(createdMovie).toBeDefined();
    expect(createdMovie.title).toEqual('Example Movie');
    expect(createdMovie.year).toEqual(2022);
    expect(createdMovie.description).toEqual('Excellent');
  });

  afterEach(async () => {
    const movieModel = module.get('MovieModel');
    await movieModel.deleteMany({});
  });
});
