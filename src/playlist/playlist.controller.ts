import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Headers,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Public } from 'src/decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserDocument } from 'src/user/user.schema';

@ApiTags('playlist')
@ApiBearerAuth()
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  //TODO возможно стоит брать id юзера из токена для подстановки в createdBy
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
  }

  @Post(':id/copy')
  copyPlaylist(
    @Param('id') id: string,
    @Req() req: Request & { user: UserDocument },
  ) {
    const { user } = req;
    return this.playlistService.copyPlaylist(id, user);
  }

  @Public()
  @Get()
  findAll(@Headers('Authorization') authorizationHeader: string) {
    if (authorizationHeader) {
      console.log('authorizationHeader: ', authorizationHeader);
      return this.playlistService.findAll(authorizationHeader);
    } else {
      console.log('authorizationHeader: ', authorizationHeader);
      return this.playlistService.findAllPublic();
    }
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: UserDocument },
  ) {
    const { user } = req;
    return this.playlistService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request & { user: UserDocument },
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    const { user } = req;
    return this.playlistService.update(id, user, updatePlaylistDto);
  }

  @Post(':id')
  addMovie(
    @Param('id') id: string,
    @Req() req: Request & { user: UserDocument },
    @Body() body: { movie: string },
  ) {
    const { user } = req;
    const { movie } = body;
    return this.playlistService.addMovie(id, user, movie);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: Request & { user: UserDocument },
  ) {
    const { user } = req;
    return this.playlistService.remove(id, user);
  }
}
