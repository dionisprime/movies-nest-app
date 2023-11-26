import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './movie.schema';

describe('MovieService', () => {
  let service: MovieService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-db'),
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
      ],
      providers: [MovieService],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be create a movie', async () => {
    const createMovieDto = {
      title: 'Example Movie',
      description: 'Excellent',
      year: 2022,
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
