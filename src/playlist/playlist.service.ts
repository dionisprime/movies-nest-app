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
    const userFromToken = await this.authService.isAuth(authorizationHeader);

    const allPlaylists = await this.playlistModel
      .find({
        $or: [
          { createdBy: userFromToken._id, isPrivate: true },
          { isPrivate: false },
        ],
      })
      .populate('movies', 'title')
      .populate('createdBy', 'username');

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

  async copyPlaylist(
    playlistId: string,
    user: UserDocument,
  ): Promise<Playlist> {
    const playlistToCopy = await this.playlistModel.findById(playlistId);
    if (!playlistToCopy || playlistToCopy.isPrivate) {
      throw new NotFoundException(ERROR_MESSAGE.PLAYLIST_NOT_AVAILABLE);
    }
    const playListId = playlistToCopy._id.toString();
    if (user.playlists.includes(playListId)) {
      throw new ConflictException(ERROR_MESSAGE.PLAYLIST_EXIST);
    }
    user.playlists.push(playListId);
    await this.userModel.updateOne(
      { _id: user._id },
      { playlists: user.playlists },
    );
    return playlistToCopy;
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

    const movieAlreadyExist = playlistToUpdate.movies.includes(movieId);

    if (movieAlreadyExist) {
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

  async countPlaylists() {
    return this.playlistModel.countDocuments().exec();
  }
}
