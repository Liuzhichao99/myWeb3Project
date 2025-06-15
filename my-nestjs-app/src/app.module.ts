import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { MessagesModule } from './messages/messages.module';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://192.168.32.135:27017/nestjs-mongodb'),
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
        '.env'
      ],
    }),
    TokenModule,
    MessagesModule,
    NftModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
