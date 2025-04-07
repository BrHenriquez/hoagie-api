import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core/modules/core.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HoagiesModule } from './hoagies/hoagies.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    CoreModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    AuthModule,
    UsersModule,
    HoagiesModule,
    CommentsModule,
  ],
})
export class AppModule {}
