import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './genre.schema';

describe('GenreService', () => {
  let service: GenreService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
      ],
      providers: [GenreService],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  it('should created a genre', async () => {
    const createGenreDto = {
      genreName: 'fantasy',
    };
    const createdGenre = await service.create(createGenreDto);

    expect(createdGenre).toBeDefined();
    expect(createdGenre.genreName).toEqual('fantasy');
  });

  afterEach(async () => {
    const genreModel = module.get('GenreModel');
    await genreModel.deleteMany({});
  });
});
