import { Module } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Role, RoleDocument, RoleSchema } from 'src/roles/role.schema';
import { User, UserSchema } from 'src/users/user.schema';

import { Token, TokenSchema } from 'src/tokens/token.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'Users' },
      { name: Role.name, schema: RoleSchema, collection: 'Roles' },
      { name: Token.name, schema: TokenSchema, collection: 'Tokens' },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [],
  providers: [],
})
export class MongoEntitiesModule {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async onModuleInit() {
    //! При первом запуске раскоментировать
    // await new this.roleModel({
    //   value: 'role_user',
    // }).save();
    // await new this.roleModel({
    //   value: 'role_admin',
    // }).save();
    //! При первом запуске раскоментировать
  }
}
