import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { MongoEntitiesModule } from 'src/connections/mongo-entities.module';

@Module({
  imports: [MongoEntitiesModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersService, TokensService],
})
export class UsersModule {}
