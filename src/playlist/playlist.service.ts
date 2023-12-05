import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist, PlaylistDocument } from './playlist.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { ERROR_MESSAGE } from '../../utils/constants';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const createdPlaylist = new this.playlistModel(createPlaylistDto);
    return createdPlaylist.save();
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistModel.find().exec();
  }

  async findAllPublic(): Promise<Playlist[]> {
    return this.playlistModel
      .find({ isPrivate: false })
      .populate('movies', 'title');
  }

  async findOne(id: string): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(id).exec();
    if (!playlist) {
      throw new NotFoundException(ERROR_MESSAGE.PLAYLIST_NOT_FOUND);
    }
    return playlist;
  }

  async update(
    id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    const updatedPlaylist = await this.playlistModel.findById(id);

    if (!updatedPlaylist) {
      throw new NotFoundException(ERROR_MESSAGE.PLAYLIST_NOT_FOUND);
    }

    updatedPlaylist.set(updatePlaylistDto);

    return updatedPlaylist.save();
  }

  async remove(id: string) {
    const deletedPlaylist = await this.playlistModel.findByIdAndDelete(id);
    if (!deletedPlaylist) {
      throw new NotFoundException(ERROR_MESSAGE.PLAYLIST_NOT_FOUND);
    }
    return deletedPlaylist;
  }
}
