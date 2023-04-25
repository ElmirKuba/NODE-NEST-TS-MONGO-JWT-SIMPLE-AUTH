import { Module } from '@nestjs/common';

import { MongoEntitiesModule } from 'src/connections/mongo-entities.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { TokensService } from 'src/tokens/tokens.service';

@Module({
  imports: [MongoEntitiesModule],
  exports: [],
  controllers: [AuthController],
  providers: [AuthService, TokensService],
})
export class AuthModule {}
