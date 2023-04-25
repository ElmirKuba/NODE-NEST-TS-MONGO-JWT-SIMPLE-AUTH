import { Module } from '@nestjs/common';

import { MongoEntitiesModule } from 'src/connections/mongo-entities.module';

import { TokensService } from './tokens.service';

import { TokensController } from './tokens.controller';

@Module({
  imports: [MongoEntitiesModule],
  exports: [],
  providers: [TokensService],
  controllers: [TokensController],
})
export class TokensModule {}
