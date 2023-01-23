import { Controller, Get } from '@nestjs/common';
import { AppService, TrackerBody } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  tracker(): TrackerBody {
    return this.appService.tracker();
  }
}
