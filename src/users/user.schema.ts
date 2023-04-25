import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from './../roles/role.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ unique: true, required: true, type: String })
  username: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ default: [], ref: () => Role, type: [String] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
