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
    const token = authorizationHeader;

    console.log('token: ', token);
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
    const allPlaylists = await this.playlistModel.find({
      createdBy: userFromToken._id,
    });

    if (allPlaylists.length < 1) {
      // то выводим только общие списки
      return this.playlistModel
        .find({ isPrivate: false })
        .populate('movies', 'title');
    }

    return allPlaylists;
  }
  //   return this.playlistModel
  //     .find()
  //     .populate('movies', 'title')
  //     .populate('createdBy', 'username')
  //     .exec();
  // }

  // async findPrivateLists(): Promise<Playlist[]> {
  //   const isOwner = await this.authService.isOwner(id, user);
  //   if (isOwner) {
  //     return this.playlistModel.find({ isPrivate: true }).populate('movies');
  //   }
  //   return this.playlistModel.find().exec();
  // }

  // async findAll(): Promise<Playlist[]> {
  //   const isOwner = await this.authService.isOwner(id, user);

  //   if (isOwner) {
  //     return this.playlistModel.find({}).populate('movies');
  //   }

  //   return this.playlistModel
  //     .find({ isPrivate: false })
  //     .populate('movies', 'title');
  // }
  // async findAll(): Promise<Movie[]> {
  //   return this.movieModel
  //     .find()
  //     .populate('movie')
  //     .populate('createdBy')
  //     .exec();
  // }

  async findAllPublic(): Promise<Playlist[]> {
    return this.playlistModel
      .find({ isPrivate: false })
      .populate('movies', 'title');
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
    console.log('playlistToUpdate.movies: ', playlistToUpdate?.movies);
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
