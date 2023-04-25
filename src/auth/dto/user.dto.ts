import mongoose from 'mongoose';
import { UserDocument } from 'src/users/user.schema';

class UserDto {
  id: mongoose.Types.ObjectId = null;
  username: string = null;
  roles: string[] = null;

  constructor(model: UserDocument) {
    this.id = model._id as mongoose.Types.ObjectId;
    this.username = model.username as string;
    this.roles = model.roles as string[];
  }
}

export default UserDto;
