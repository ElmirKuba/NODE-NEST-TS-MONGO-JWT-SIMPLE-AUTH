import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  MongooseModule,
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

import environment from 'src/environments/environment';

@Injectable()
class MongooseService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: environment.DB_URL,
      dbName: environment.DB_NAME,
    };
  }
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseService,
    }),

    ConfigModule.forRoot({
      load: [
        () => {
          return {
            database: {
              url: environment.DB_URL,
              name: environment.DB_NAME,
            },
          };
        },
      ],
    }),
  ],
  exports: [MongooseModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class MongoDB {}
