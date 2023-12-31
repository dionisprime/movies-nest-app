import { Test, TestingModule } from '@nestjs/testing';
import { DirectorService } from './director.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Director, DirectorSchema } from './director.schema';

describe('DirectorService', () => {
  let service: DirectorService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([
          { name: Director.name, schema: DirectorSchema },
        ]),
      ],
      providers: [DirectorService],
    }).compile();

    service = module.get<DirectorService>(DirectorService);
  });

  it('should be create a director', async () => {
    const createDirectorDto = {
      directorName: 'Example Director',
      dateOfBirth: new Date('1950-11-22'),
    };
    const createdDirector = await service.create(createDirectorDto);

    expect(createdDirector).toBeDefined();
    expect(createdDirector.directorName).toEqual('Example Director');
  });

  it('should return all directors', async () => {
    const directors = await service.findAll();
    expect(directors).toBeInstanceOf(Array);
  });

  afterEach(async () => {
    const directorModel = module.get('DirectorModel');
    await directorModel.deleteMany({});
  });
});
