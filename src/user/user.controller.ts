import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/me')
  me(@Req() req: Request) {
    const { user } = req;
    return user;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.userService.findOne(_id);
  }

  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(_id, updateUserDto);
  }

  @Patch(':userId/playlists/:playlistId')
  removePlaylistFromUser(
    @Param('userId') userId: string,
    @Param('playlistId') playlistId: string,
  ) {
    return this.userService.removePlaylistFromUser(userId, playlistId);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.userService.remove(_id);
  }
}
