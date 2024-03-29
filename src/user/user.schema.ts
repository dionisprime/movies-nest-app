import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ROLES } from '../../utils/constants';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [ROLES.USER] })
  roles: string[];

  @Prop()
  token?: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
    default: [],
  })
  playlists: string[];

  @Prop({ default: false })
  isSubscribedToNotifications: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
