import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hoagie, HoagieSchema } from './schemas/hoagie.schema';
import { HoagiesService } from './hoagies.service';
import { HoagiesController } from './hoagies.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hoagie.name, schema: HoagieSchema }]),
  ],
  controllers: [HoagiesController],
  providers: [HoagiesService],
  exports: [HoagiesService],
})
export class HoagiesModule {}
