import { Module } from '@nestjs/common';
import { TrackerService } from './index.service';
import { TrackerController } from './index.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracker } from './index.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tracker])],
  providers: [TrackerService],
  controllers: [TrackerController],
})
export class TrackerModule {}
