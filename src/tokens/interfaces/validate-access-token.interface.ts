import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface ValidateAccessToken extends JwtPayload {
  id: mongoose.Types.ObjectId;
  username: string;
  roles: string[];
}
