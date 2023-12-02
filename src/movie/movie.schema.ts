import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Genre } from '../genre/genre.schema';
import { Director } from '../director/director.schema';

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }] })
  genre: Genre[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Director' })
  director: Director;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
