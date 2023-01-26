import { Controller, Get, Post } from '@nestjs/common';
import { TrackerService } from './index.service';
import { Tracker } from './index.entity';
import { InsertResult } from 'typeorm';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get('/findAll')
  async findAll(): Promise<Tracker[]> {
    return this.trackerService.findAll();
  }

  @Post('/insert')
  async insert(): Promise<InsertResult> {
    return this.trackerService.insert();
  }
}
