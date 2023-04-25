import { Module } from '@nestjs/common';

import { MongoDB } from './connections/mongoDb';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TokensModule } from './tokens/tokens.module';
import { MongoEntitiesModule } from './connections/mongo-entities.module';

@Module({
  imports: [
    MongoDB,
    MongoEntitiesModule,
    AuthModule,
    UsersModule,
    RolesModule,
    TokensModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
