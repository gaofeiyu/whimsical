import { Controller, Post } from '@nestjs/common';
import { TrackerService } from './index.service';
import { Tracker } from './index.entity';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  findAll(): Promise<Tracker[]> {
    return this.trackerService.findAll();
  }
}
