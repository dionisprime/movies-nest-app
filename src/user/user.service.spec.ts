import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies-app-test-db'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be create a user', async () => {
    const createUserDto = {
      username: 'Example User',
      email: 'example@mail.com',
      password: 'test',
      roles: ['user'],
    };
    const createdUser = await service.create(createUserDto);

    expect(createdUser).toBeDefined();
    expect(createdUser.username).toEqual('Example User');
  });

  afterEach(async () => {
    const userModel = module.get('UserModel');
    await userModel.deleteMany({});
  });
});
