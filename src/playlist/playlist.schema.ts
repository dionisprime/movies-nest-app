import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Movie } from '../movie/movie.schema';
import { User } from '../user/user.schema';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema()
export class Playlist {
  @Prop({ required: true })
  playlistName: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  })
  movies: Movie;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ default: true })
  isPrivate: boolean;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
