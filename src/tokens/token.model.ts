import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/user.schema';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  _id: mongoose.Types.ObjectId;

  @Prop({ ref: () => User, type: mongoose.Types.ObjectId })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
