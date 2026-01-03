import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { ListingsModule } from './listings/listings.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time window in milliseconds (60 seconds)
      limit: 10, // Maximum number of requests per time window
    }]),
    ListingsModule,
    CategoriesModule,
    UsersModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
