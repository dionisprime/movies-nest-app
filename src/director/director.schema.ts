import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DirectorDocument = HydratedDocument<Director>;

@Schema()
export class Director {
  @Prop({ required: true })
  directorName: string;

  @Prop()
  dateOfBirth: Date;
}

export const DirectorSchema = SchemaFactory.createForClass(Director);
