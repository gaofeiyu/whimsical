import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

export type TrackerBody = {
  projectId: string;
  actionId: string;
  type: string;
  params: unknown;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 装饰器要改成post
  @Get()
  tracker(): any {
    // 在这里写数据库并根据结果处理返回
    return this.appService.common({
      projectId: '1',
      actionId: '1',
      type: 'count',
      params: {},
    });
  }
}
