import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  _id: mongoose.Types.ObjectId;

  @Prop({ unique: true, default: 'user', type: String })
  value: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
