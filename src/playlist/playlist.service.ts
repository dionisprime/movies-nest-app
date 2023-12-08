import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist, PlaylistDocument } from './playlist.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { ERROR_MESSAGE } from '../../utils/constants';
import { User, UserDocument } from '../user/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    //возможно стоит брать id юзера из токена для подстановки в createdBy
    const createdPlaylist = new this.playlistModel(createPlaylistDto);
    return createdPlaylist.save();
  }

  async findAll(authorizationHeader: string): Promise<Playlist[]> {
    /**
     * надо проверять если юзер из токена не является владельцем, то
     * не отдавать приватные листы
     * а если является то отдавать
     */

    // надо доставать юзера из базы по токену
    const userFromToken = await this.authService.isAuth(authorizationHeader);
    // console.log('userFromToken: ', userFromToken);

    // console.log('userFromToken._id: ', userFromToken._id);
    // надо выдавать только те плейлисты которые создал юзер из токена
    // const allPlaylists = await this.playlistModel.find({
    //   createdBy: userFromToken._id,
    // });
    const allPlaylists = await this.playlistModel
      .find({
        $or: [
          { createdBy: userFromToken._id, isPrivate: true }, // Юзер является владельцем и это приватный список
          { isPrivate: false }, // Это общий список
        ],
      })
      .populate('movies', 'title')
      .populate('createdBy', 'username');
    /**если пользователь является владельцем (владельцем приватного списка),
     * ему будут показаны только его приватные списки и общие списки.
     * Если пользователь не является владельцем, ему будут показаны только общие списки. */

    return allPlaylists;
  }

  async findAllPublic(): Promise<Playlist[]> {
    return this.playlistModel
      .find({ isPrivate: false })
      .populate('movies', 'title')
      .populate('createdBy', 'username');
  }

  async findOne(id: string, user?: UserDocument): Promise<Playlist | null> {
    const playlist = await this.playlistModel
      .findOne({ _id: id, createdBy: user?._id })
      .exec();
    if (!playlist) {
      throw new NotFoundException(ERROR_MESSAGE.NO_PERMISSIONS);
    }
    return playlist;
  }

  async update(
    playlistId: string,
    user: UserDocument,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    await this.authService.isOwner(playlistId, user);

    const playlistToUpdate = await this.playlistModel.findById(playlistId);

    if (!playlistToUpdate) {
      throw new NotFoundException(ERROR_MESSAGE.PLAYLIST_NOT_FOUND);
    }

    playlistToUpdate.set(updatePlaylistDto);

    return playlistToUpdate.save();
  }

  async addMovie(playlistId: string, user: UserDocument, movieId: string) {
    await this.authService.isOwner(playlistId, user);

    const playlistToUpdate = await this.playlistModel.findById(playlistId);

    if (!playlistToUpdate) {
      throw new NotFoundException(ERROR_MESSAGE.PLAYLIST_NOT_FOUND);
    }
    if (playlistToUpdate.movies.includes(movieId)) {
      throw new ConflictException(ERROR_MESSAGE.MOVIE_EXIST);
    }
    playlistToUpdate.movies.push(movieId);
    await playlistToUpdate.save();

    return playlistToUpdate;
  }

  async remove(id: string, user: UserDocument) {
    await this.authService.isOwner(id, user);

    const deletedPlaylist = await this.playlistModel.findByIdAndDelete(id);

    return deletedPlaylist;
  }
}
